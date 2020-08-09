import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Header from '../Header/Header.jsx';
import styles from './FrontRoute.css';


/**
 * FrontRoute component
 */
export default () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = '';
  }, []);

  return (
    <div className={ styles.front }>
      <section className={ styles.hero }>
        <Header title="Fluentcards" />

        <div className={ styles.container }>
          <p>Create flashcards from dictionary lookups in browser and on Kindle</p>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <p>
            <h1>Export Kindle Vocabulary to Anki</h1>

            <Link to="/kindle">
              <img src="/images/kindle.jpg" className={ styles.imageCenter } />
            </Link>

            Every time you look up a word in Kindle's dictionary, it saves the word along with its context into the device's memory. Fluentcards lets you extract all the lookups words to Anki.

            <Link to="/kindle" className={ styles.cta } href="/kindle">
              Import from your Kindle
            </Link>
          </p>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <p>
            <h1>Collect words with our browser extension</h1>

            <a target="_blank"
               rel="nofollow"
               href="https://chrome.google.com/webstore/detail/fluentcards-dictionary/fdppeilamokmgmobedkdmjiedkbblngd">
              <img src="/images/extension.png" className={ styles.imageRight } />
            </a>

            Install our Chrome extension for instant dictionary look-up. Start collecting your own flashcards and build up your vocabulary.
            When you save a word, we also save the context sentence.

            <a className={ styles.cta }
               target="_blank"
               rel="nofollow"
               href="https://chrome.google.com/webstore/detail/fluentcards-dictionary/fdppeilamokmgmobedkdmjiedkbblngd">
              Install Chrome Extension
            </a>
          </p>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <p>
            <h1>Organize and edit</h1>

            <Link to="/vocab">
              <img src="/images/vocab.png" className={ styles.imageCenter } />
            </Link>

            Fluentcards makes it easy to view and edit your saved words. Add cloze tests, pronunciation audio and images.
          </p>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <p>
            <h1>Export and review</h1>

            <img src="/images/anki.jpg" className={ classnames(styles.imageLeft, styles.imageTall) } />

            You can export your Fluentcards decks
            to <a href="https://apps.ankiweb.net/" target="_blank" rel="nofollow">Anki</a> or Memrise.

            <br />
            <br />

            Anki is a popular Spaced Repetion software that saves your time by showing flashcards with ever-increasing intervals.

            <br />
            <br />

            Fluentcards generates two alternative types of decks: Basic and Cloze. Basic has a looked-up word on the front of the flashcard, and the word's definiton and context on the back side.

            <br />
            <br />

            The so-called Cloze flashcards have the context on the front, with the looked-up word replaced with <code>...</code>. The word itself is on the back.

            <a className={ styles.cta } href="https://apps.ankiweb.net/docs/manual.html#importing-text-files" target="_blank" rel="nofollow">
              Learn how to import into Anki
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
