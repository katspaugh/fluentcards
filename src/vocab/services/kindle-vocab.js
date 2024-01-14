import config from '../../config';

const localStorage = window.localStorage;
const storageKey = 'fluentcards.kindleBooks';

/**
 * @typedef {import('./kindle').Vocab} Vocab
 * @typedef {import('./kindle').Book} Book 
 *
 * @typedef {undefined | string | Array<{ text: string }>} ExtendedDef
 *
 * @typedef {Object} Word
 * @property {string} selection
 * @property {string} context
 * @property {ExtendedDef} def
 *
 * @typedef {Object} BookDeck a collection of words from a Kindle book
 * @property {string} title
 * @property {string} authors
 * @property {string} lang
 * @property {string} language
 * @property {string} cover
 * @property {Word[]} words
 */

class KindleVocab {
  constructor() {
    /**
     * @type {Book[]} books
     */
    this.books = [];

    this.restoreSavedBooks();

    // if (!this.books.length) {
    //   fetch('/data/books.json')
    //     .then(resp => resp.json())
    //     .then(data => !this.setBooks(data));
    // }
  }

  /**
   * Restore books from the storage
   */
  restoreSavedBooks() {
    const savedBooks = localStorage.getItem(storageKey);
    savedBooks && this.setBooks(JSON.parse(savedBooks));
  }

  /**
   * Update books and save into the storage
   *
   * @param {Array<Book>} books
   */
  setBooks(books) {
    this.books = books;
    localStorage.setItem(storageKey, JSON.stringify(this.books));
  }

  /**
   * Get a book by id.
   *
   * @param {string} id the book id (must exist)
   * @returns {BookDeck}
   */
  getBook(id) {
    const book = this.books.find(item => item.id === id);

    return {
      lang: book.language,
      language: config.languages[book.language] || book.language,
      title: book.title,
      authors: book.title,
      cover: book.cover,

      words: book.vocabs
        .filter(item => !item._removed)
        .map(item => ({
          selection: item.selection || '',
          context: item.context,
          def: item.def || [
            { text: item.baseForm }
          ]
        }))
    };
  }

  /**
   * Get a list of books
   *
   * @returns {Book[]}
   */
  getBooks() {
    return this.books;
  }

  /**
   * Update a vocabulary item
   *
   * @param {string} id
   * @param {import('./vocab-store').VocabItem} item
   * @param {Partial<Vocab>} newFields
   */
  updateItem(id, item, newFields) {
    const book = this.books.find(book => book.id === id);
    const vocab = book.vocabs.find(vocab => {
      return (vocab.selection === item.selection) && (vocab.context === item.context);
    });

    Object.assign(vocab, newFields);

    this.setBooks(this.books);
  }
}

export default new KindleVocab();
