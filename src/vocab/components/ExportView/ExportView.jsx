import React, { PureComponent } from 'react';
import exportCsv from '../../services/csv';
import styles from './ExportView.css';


const helpTexts = {
  plain: {
    content: (
      <div>
        <p>
          <ul>
            <li>Open Anki</li>
            <li>Choose an existing deck or create a new deck</li>
            <li>Click the File menu and then "Import"</li>
            <li>Find the file that you downloaded from this page</li>
            <li>Choose the "Basic" type (it's the default)</li>
            <li>Column 1 is a looked-up word, column 2 is context, column 3 is an optional dictionary definition.</li>
            <li>Click on the "Import" button</li>
          </ul>
          See the <a target="_blank" href="https://docs.ankiweb.net/#/importing">Anki manual</a> for more details.
        </p>
      </div>
    ),
    image: (<img src="/images/anki-basic.png" width="582" />)
  },

  basic: {
    content: (
      <div>
        <p>
          <ul>
            <li>Open Anki</li>
            <li>Choose an existing deck or create a new deck</li>
            <li>Click the File menu and then "Import"</li>
            <li>Find the file that you downloaded from this page</li>
            <li>Choose the "Basic" type (it's the default)</li>
            <li>Check the "Allow HTML" checkbox</li>
            <li>Click on the "Import" button</li>
          </ul>
          See the <a target="_blank" href="https://docs.ankiweb.net/#/importing">Anki manual</a> for more details.
        </p>
      </div>
    ),
    image: (<img src="/images/anki-basic.png" width="582" />)
  },

  cloze: {
    content: (
      <div>
        <p>
          <ul>
            <li>Open Anki</li>
            <li>Choose an existing deck or create a new deck</li>
            <li>Click the File menu and then "Import"</li>
            <li>Find the file that you downloaded from this page</li>
            <li>Choose the "Cloze" type</li>
            <li>Click on the "Import" button</li>
          </ul>
          See the <a target="_blank" href="https://docs.ankiweb.net/#/importing">Anki manual</a> for more details.
        </p>
      </div>
    ),
    image: (<img src="/images/anki-cloze.png" width="582" />)
  }
};

/**
 * ExportView component
 *
 * @typedef {object} Props
 * @prop {string[]} words
 * @prop {string} name File name
 * @prop {keyof typeof helpTexts} type Export type
 *
 * @extends {PureComponent<Props>}
 */
export default class ExportView extends PureComponent {
  componentWillMount() {
    this.tsv = encodeURIComponent(exportCsv(this.props.words, this.props.type));
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    const help = helpTexts[this.props.type];
    const date = new Date().toLocaleDateString();
    const fileName = `${ this.props.name }_${ this.props.type }_${ date }.tsv`;
    const dataUri = `data:text/tab-separated-values,${ this.tsv }`;

    return (
      <div className={ styles.container }>
        <p>The deck has been successfully exported.</p>

        <div className={ styles.download }>
          <a download={ fileName } href={ dataUri }>
            <img src="/images/icons/download.svg" />Download your deck
          </a>
        </div>

        <div className={ styles.row }>
          <div className={ styles.col }>

            <h4>How to import?</h4>

            { help.content }
          </div>

          <div className={ styles.col }>{ help.image }</div>
        </div>
      </div>
    );
  }
}
