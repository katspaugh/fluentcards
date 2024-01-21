import { ReplaySubject } from 'rx-lite';
import ExtensionVocab from './extension-vocab';
import KindleVocab from './kindle-vocab';
import config from '../../config';

/**
 * @typedef {import('../services/extension-vocab').ExtensionDeck} ExtensionDeck
 * @typedef {import('../services/kindle').Book} Book
 * @typedef {import('../services/kindle-vocab').BookDeck} BookDeck
 */

/**
 * A looked up word.
 *
 * @typedef {Object} VocabItem
 * @property {string} baseForm the word stem
 * @property {string} selection the word as highlighted on the device
 * @property {string} context the context the word appears in
 * @property {string} language
 * @property {any[]} def
 * @property {boolean} _removed
 */

class VocabStore extends ReplaySubject {
  constructor() {
    super(1);

    ExtensionVocab.subscribe(() => {
      this.onNext({});
    });

    this.onNext({});
  }

  /**
   * Gets the decks from the fluentcards extension and the Kindle library.
   *
   * @returns {{extensionDecks: ExtensionDeck[], kindleBooks: Book[]}}
   */
  getDecks() {
    return {
      extensionDecks: ExtensionVocab.getDecks(),
      kindleBooks: KindleVocab.getBooks()
    };
  }

  /**
   * Retrieves a deck of words by language code or book id.
   *
   * @param {string} id can either be a language code or a book id.
   *  If language code, this method will collect all words for that language.
   *  Otherwise, the vocabulary from the book will be retrieved.
   */
  getDeck(id) {
    return id in config.languages ? ExtensionVocab.getDeck(id) : KindleVocab.getBook(id);
  }

  /**
   * Updates a vocabulary item.
   *
   * @param {string} id a language code or a book id. If it is a language code, this method updates an extension vocabulary. Otherwies, it updates a book vocabulary item.
   * @param {VocabItem} item
   * @param {Partial<VocabItem>} newFields
   */
  updateItem(id, item, newFields) {
    id in config.languages ?
      ExtensionVocab.updateItem(item, newFields) :
      KindleVocab.updateItem(id, item, newFields);

    this.onNext({});
  }

  /**
   * Removes a word from this collection (sets the removed flag to `true`).
   *
   * @param {string} id the collection id (either a language code or a book id)
   * @param {VocabItem} item
   */
  removeItem(id, item) {
    this.updateItem(id, item, { _removed: true });
  }
}

export default new VocabStore();
