import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import VocabStore from '../../services/vocab-store';
import styles from './Decks.css';

/**
 * Decks component
 */
export default class Decks extends PureComponent {
  /**
   * Initialize the state
   */
  constructor() {
    super();

    this.state = {
      decks: null,
      books: null
    };
  }

  componentWillMount() {
    this.sub = VocabStore
      .subscribe(() => {
        const data = VocabStore.getDecks()

        this.setState({
          decks: data.extensionDecks,
          books: data.kindleBooks
        });
      });
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    const { decks, books } = this.state;

    if (decks.length === 1 && !books.length) return (
      <Redirect to={ `/vocab/${ decks[0].lang }` } />
    );

    if (!decks.length && !books.length) return (
      <div className={ styles.container }>
        <h1 className={ styles.heading }>
          <a target="_blank"
             rel="nofollow"
             href="https://chrome.google.com/webstore/detail/fluentcards-dictionary/fdppeilamokmgmobedkdmjiedkbblngd">
            Install our Chrome extension
          </a>
        </h1>

        <p className={ styles.paragraph }>
          <a target="_blank"
             rel="nofollow"
             href="https://chrome.google.com/webstore/detail/fluentcards-dictionary/fdppeilamokmgmobedkdmjiedkbblngd">
            <img src="/images/extension.png" />
          </a>

          <span>
            Install our Chrome extension for instant dictionary look-up.
            Start collecting flashcards to build up your vocabulary.
          </span>
        </p>
      </div>
    );

    const deckItems = decks.map(group => {
      return (
        <Link to={ `/vocab/${ group.lang }` } className={ styles.deck }>
          <h3>{ group.language }</h3>

          <p>{ group.words.length } words</p>
        </Link>
      );
    });

    const bookItems = books.map(book => {
      return (
        <Link to={ `/vocab/${ book.id }` } className={ styles.book } key={ book.id }>
          <div style={ book.cover ? { backgroundImage: `url(${ book.cover })` } : null }>
            { book.cover ? '' : <h5>{ book.title }</h5> }
            <p>{ book.count } words</p>
          </div>
        </Link>
      );
    });

    return (
      <div className={ styles.container }>
        { deckItems.length ? (
          <div>
            <p>Your web vocabulary:</p>

            <div className={ styles.decks }>
              { deckItems }
            </div>
          </div>
        ) : '' }

        { bookItems.length ? (
          <div>
            <p>Your Kindle vocabulary:</p>

            <div className={ styles.decks }>
              { bookItems }
            </div>
          </div>
        ) : '' }
      </div>
    );
  }
}
