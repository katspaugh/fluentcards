import { ReplaySubject } from 'rx-lite';
import ExtensionVocab from './extension-vocab';
import KindleVocab from './kindle-vocab';
import config from '../../config';

/**
 * Vocab item type
 * @typedef {Object} VocabItem
 * @property {string} selection
 * @property {string} context
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
   * Get decks
   *
   * @returns {any}
   */
  getDecks() {
    return {
      extensionDecks: ExtensionVocab.getDecks(),
      kindleBooks: KindleVocab.getBooks()
    };
  }

  /**
   * Get a deck by id
   *
   * @param {string} id
   * @returns {any}
   */
  getDeck(id) {
    return id in config.languages ? ExtensionVocab.getDeck(id) : KindleVocab.getBook(id);
  }

  /**
   * Update a vocabulary item
   *
   * @param {VocabItem} item
   * @param {any} newFields
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
   * @param {VocabItem} item
   */
  removeItem(id, item) {
    this.updateItem(id, item, { _removed: true });
  }
}

export default new VocabStore();
