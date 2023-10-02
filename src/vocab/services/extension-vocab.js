import { ReplaySubject, Observable } from 'rx-lite';
import config from '../../config';

const localStorage = window.localStorage;
const storageKey = 'fluentcards.extensionWords';

/**
 * Vocab item type
 * @typedef {Object} VocabItem
 * @property {string} selection
 * @property {string} context
 * @property {string} language
 * @property {any[]} def
 * @property {boolean} _removed
 */

/**
 * Deck item type
 * @typedef {Object} DeckItem
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
   * Restore words from the storage
   */
  restoreSavedWords() {
    const savedWords = localStorage.getItem(storageKey);
    savedWords && this.setWords(JSON.parse(savedWords));
  }

  /**
   * Update words and save into the storage
   *
   * @param {VocabItem[]} words
   */
  setWords(words) {
    this.words = words;
    localStorage.setItem(storageKey, JSON.stringify(this.words));
  }

  /**
   * Add words that aren't in the set
   *
   * @param {VocabItem[]} words
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
   * Get a list of words by language
   *
   * @param {string} lang
   * @returns {DeckItem}
   */
  getDeck(lang) {
    return {
      lang,
      language: config.languages[lang] || lang,
      words: this.words.filter(item => !item._removed && item.language === lang)
    };
  }

  /**
   * Get a list of lists of words
   *
   * @returns {DeckItem[]}
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
   * Update a vocabulary item
   *
   * @param {VocabItem} item
   * @param {any} newFields
   */
  updateItem(item, newFields) {
    if (!this.words.includes(item)) return;

    Object.assign(item, newFields);

    this.setWords(this.words);
  }
}

export default new ExtensionVocab();
