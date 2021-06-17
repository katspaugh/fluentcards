import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Header from '../Header/Header.jsx';
import styles from './FrontRoute.css';


/**
 * FrontRoute component
 */
export default () => {
  return (
    <div className={ styles.front }>
      <div className={ styles.grid }>
        <section className={ styles.kindle }>
          <Link to="/kindle">
            Kindle to Anki
          </Link>

          <Link to="/kindle">
            <img src="/images/kindle.svg" alt="Kindle" />
          </Link>

          <p>Export your Kindle dictionary look-ups as Anki flashcards.</p>
          <p>
            ℹ️ <a href="https://learnoutlive.com/kindle-vocabulary-builder-anki-flashcards/">Read André Klein's How-To</a>
          </p>
        </section>

        <section className={ styles.browser }>
          <a href="https://chrome.google.com/webstore/detail/fluentcards-dictionary/fdppeilamokmgmobedkdmjiedkbblngd">
            Browser Dictionary

            <img src="/images/browser.svg" alt="Browser" />
          </a>

          <p>
            Collect new words in the browser using the Fluentcards dictionary extenstion. Edit and export into Anki.
          </p>
        </section>
      </div>
    </div>
  );
}
