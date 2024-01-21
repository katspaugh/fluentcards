import { ReplaySubject, Observable } from 'rx-lite';
import config from '../../config';

const localStorage = window.localStorage;
const storageKey = 'fluentcards.extensionWords';

/**
 * @typedef {Object} VocabItem
 * @property {string} selection
 * @property {string} context
 * @property {string} language
 * @property {any[]} def
 * @property {boolean} _removed
 */

/**
 * A deck of words from the fluentcards extension.
 *
 * @typedef {Object} ExtensionDeck
 * @property {string} lang
 * @property {string} language
 * @property {VocabItem[]} words
 */

class ExtensionVocab extends ReplaySubject {
  constructor() {
    super(1);

    /**
     * @type {VocabItem[]}
     */
    this.words = [];

    this.restoreSavedWords();
    this.addExtensionWords();
  }

  /**
   * Add words from the extension
   */
  addExtensionWords() {
    Observable
      .interval(50)
      .map(() => {
        if (!window.fluentcards) throw Error('No extension data');
        return window.fluentcards;
      })
      .retry(100)
      .take(1)
      .subscribe(
        words => this.addUniqueWords(words),
        err => console.warn(err)
      );
  }

  /**
   * Restore words from local storage
   *
   * @see storageKey
   */
  restoreSavedWords() {
    const savedWords = localStorage.getItem(storageKey);
    savedWords && this.setWords(JSON.parse(savedWords));
  }

  /**
   * Updates the words and saves them into local storage.
   *
   * @param {VocabItem[]} words
   */
  setWords(words) {
    this.words = words;
    localStorage.setItem(storageKey, JSON.stringify(this.words));
  }

  /**
   * Adds words that are not yet in the list.
   *
   * @param {VocabItem[]} words the list of words to add. The `selection` and
   *   `context` members will be used to establish item equality.
   */
  addUniqueWords(words) {
    const newWords = words.filter(word => {
      return !this.words
        .some(item => item.selection === word.selection && item.context === word.context);
    });

    if (newWords.length) {
      this.setWords(this.words.concat(newWords));
      this.onNext({});
    }
  }

  /**
   * Collects all words associated with a language into a deck.
   *
   * @param {string} lang the language code.
   * @returns {ExtensionDeck}
   */
  getDeck(lang) {
    return {
      lang,
      language: config.languages[lang] || lang,
      words: this.words.filter(item => !item._removed && item.language === lang)
    };
  }

  /**
   * Collects all words into decks.
   *
   * @returns {ExtensionDeck[]}
   */
  getDecks() {
    const words = this.words.filter(item => !item._removed);

    const groups = words.reduce((acc, word) => {
      const lang = word.language;
      acc[lang] = acc[lang] || [];
      acc[lang].push(word);
      return acc;
    }, {});

    return Object.keys(groups)
      .sort((a, b) => groups[a].length - groups[b].length)
      .map(lang => ({
        lang,
        language: config.languages[lang] || lang,
        words: groups[lang]
      }));
  }

  /**
   * Updates a vocabulary item and saves everything to local storage.
   *
   * @param {VocabItem} item
   * @param {Partial<VocabItem>} newFields
   */
  updateItem(item, newFields) {
    if (!this.words.includes(item)) return;

    Object.assign(item, newFields);

    this.setWords(this.words);
  }
}

export default new ExtensionVocab();
