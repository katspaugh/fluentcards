import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FrontRoute.css';

/**
 * FrontRoute component
 */
export default () => {
  return (
    <div className={ styles.front }>
      <section>
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
    </div>
  );
}
