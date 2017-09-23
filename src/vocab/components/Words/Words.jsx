import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import VocabStore from '../../services/vocab-store';
import { lookup } from '../../services/lookup';
import Header from '../../../shared/components/Header/Header.jsx';
import Loader from '../../../shared/components/Loader/Loader.jsx';
import HeadWord from '../HeadWord/HeadWord.jsx';
import Definition from '../Definition/Definition.jsx';
import ExportView from '../ExportView/ExportView.jsx';
import Context from '../Context/Context.jsx';
import styles from './Words.css';


/**
 * Words component
 */
export default class Words extends PureComponent {
  constructor() {
    super();

    this.state = {
      deck: null,
      exportType: null,
      isReversed: false
    };

    this._toggleReverse = () => this.setState({ isReversed: !this.state.isReversed });
  }

  exportDeck(exportType) {
    this.setState({ exportType });
  }

  changeWord(item, value) {
    lookup(value, this.state.deck.lang)
      .then(data => {
        VocabStore.updateItem(this.props.id, item, { selection: value, def: data.def });
      });
  }

  changeDef(item, value) {
    VocabStore.updateItem(this.props.id, item, { def: [
      {
        text: item.selection,
        tr: value.split('; ').map(text => ({ text }))
      }
    ] });
  }

  changeContext(item, value) {
    VocabStore.updateItem(this.props.id, item, { context: value });
  }

  removeItem(item) {
    VocabStore.removeItem(this.props.id, item);
  }

  addDefinitions(deck) {
    const words = deck.words.filter(word => {
      return !word.def || !word.def[0] || !word.def[0].tr || !word.def[0].tr.length;
    });

    const updateWord = word => {
      return lookup(word.selection, deck.lang)
        .then(data => {
          VocabStore.updateItem(this.props.id, word, { def: data.def });
        });
    };

    const loop = index => {
      const word = words[index];
      if (!word) return;

      updateWord(word).then(() => {
        setTimeout(() => {
          loop(index + 1);
        }, 300);
      });
    };

    loop(0);
  }

  componentWillMount() {
    this.sub = VocabStore.subscribe(() => {
      const deck = VocabStore.getDeck(this.props.id);

      this.setState({ deck });

      if (!this.state.deck) {
        this.addDefinitions(deck);
      }
    });
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    const { deck, exportType } = this.state;

    if (!deck) {
      return (
        <div className={ styles.container }>
          <Loader />
        </div>
      );
    }

    if (exportType) {
      return (
        <div className={ styles.container }>
          <div className={ styles.exporting }>
            <ExportView name={ deck.title || deck.language } words={ deck.words } type={ exportType } />
          </div>
        </div>
      );
    }

    const controls = (
      <div className={ styles.controls }>
        <div className={ styles.spacer } />

        <h4>Download the deck as:</h4>

        <button className={ styles.exportButton } onClick={ () => this.exportDeck('basic') }>
          Anki Basic
        </button>

        <button className={ styles.exportButton } onClick={ () => this.exportDeck('cloze') }>
          Anki Cloze
        </button>

        <button className={ styles.exportButton } onClick={ () => this.exportDeck('plain') }>
          Memrise
        </button>
      </div>
    );

    const words = deck.words.map((item, index) => {
      return (
        <div className={ styles.entry } key={ index }>
          <div className={ classnames(styles.col, styles.count) }>
            { index + 1 }
          </div>

          <div className={ classnames(styles.col, styles.word) }>
            <HeadWord
              lang={ deck.lang }
              def={ item.def }
              onChange={ val => this.changeWord(item, val) } />
          </div>

          <div className={ classnames(styles.col, styles.definition) }>
            <Definition
              def={ item.def }
              onChange={ val => this.changeDef(item, val) }
            />
          </div>

          <div className={ classnames(styles.col, styles.context) }>
            <Context
              selection={ item.selection }
              context={ item.context }
              onChange={ val => this.changeContext(item, val) }
            />
          </div>

          <div className={ classnames(styles.col, styles.remove) }>
            <button className={ styles.button } onClick={ () => this.removeItem(item) }>×</button>
          </div>
        </div>
      );
    });

    return (
      <div>
        <Header title={ deck.title || `${ deck.language }` }>
          <Link to="/vocab">{ deck.title ? 'Books' : 'Decks' }</Link>
          { ' › ' }
        </Header>

        <div className={ styles.container }>
          { controls }

          <div className={ styles.words }>
            <div className={ classnames(styles.entry, styles.header) }>
              <div className={ classnames(styles.col, styles.count) }>
                <button className={ styles.button } onClick={ this._toggleReverse }>⇅</button>
              </div>
              <div className={ styles.col }>Word</div>
              <div className={ styles.col }>Definition</div>
              <div className={ classnames(styles.col, styles.centered, styles.contextHeader) }>Context</div>
            </div>

            { this.state.isReversed ? words.reverse() : words }
          </div>

          <div className={ styles.bottom }>
            { controls }
          </div>
        </div>
      </div>
    );
  }
}
