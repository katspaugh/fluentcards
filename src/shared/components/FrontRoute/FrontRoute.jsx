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
      <section className={ styles.hero }>
        <Header title="Fluentcards" />

        <div className={ styles.container }>
          <p>Achieve fluency in a language through smart&nbsp;flashcards</p>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <p>
            <h1>Collect Words</h1>

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
            <h1>Organize and Edit</h1>

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
            <h1>Export and Review</h1>

            <img src="/images/anki.jpg" className={ classnames(styles.imageLeft, styles.imageTall) } />

            You can export your entire flashcards collection
            into <a href="https://apps.ankiweb.net/" target="_blank" rel="nofollow">Anki</a> or <a href="https://www.memrise.com/" target="_blank" rel="nofollow">Memrise</a> for the <b>Spaced Repetition</b> practice.
            Create beautiful decks and review the flashcards on your phone or computer.

            <br />
            <br />

            Anki saves your time by repeatedly showing you flashcards right at the time when you're about to forget them. Take advantage of the scientifically proven SRS method to boost your vocabulary.

            <a className={ styles.cta } href="https://apps.ankiweb.net/docs/manual.html#importing-text-files" target="_blank" rel="nofollow">
              Learn how to import into Anki
            </a>
          </p>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <p>
            <h1>Import the Kindle Vocabulary</h1>

            <Link to="/kindle">
              <img src="/images/kindle.jpg" className={ styles.imageCenter } />
            </Link>

            Every time you look up a word in the Kindle's dictionary, it saves the word along with the context into the device's memory. Fluentcards lets you extract all the looked-up words to review conviniently in Anki.

            <Link to="/kindle" className={ styles.cta } href="/kindle">
              Import from your Kindle
            </Link>
          </p>
        </div>
      </section>

      <section>
        <div className={ styles.container }>
          <p>
            <h1>Grammar Drills</h1>

            <a href="https://grammar.fluentcards.com">
              <img src="/images/grammar.png" className={ styles.imageRight } />
            </a>

            Cement your grammar knowledge with infinite grammar drills.

            <br />
            <br />

            We dynamically generate grammar exercises from classical, sci-fi and fantasy books and movie subtitles.

            <a href="https://grammar.fluentcards.com" className={ styles.cta }>
              Start doing exercises
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
