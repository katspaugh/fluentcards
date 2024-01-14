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
 * Vocab item type
 *
 * @typedef {Object} VocabItem
 * @property {string} baseForm word stem
 * @property {string} selection the word as highlighted on the device
 * @property {string} context word context
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
   * Get decks.
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
   * Get a deck by language or book id.
   *
   * @param {string} id can either be a language code or a book id. If
   *  language code, this method will attempt to retrieve an extension deck.
   *  Otherwise, a book will be retrieved.
   * @returns {BookDeck | ExtensionDeck}
   */
  getDeck(id) {
    return id in config.languages ? ExtensionVocab.getDeck(id) : KindleVocab.getBook(id);
  }

  /**
   * Update a vocabulary item
   *
   * @param {string} id
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
   * Remove a vocabulary item
   *
   * @param {string} id
   * @param {VocabItem} item
   */
  removeItem(id, item) {
    this.updateItem(id, item, { _removed: true });
  }
}

export default new VocabStore();
