import config from '../../config';

const localStorage = window.localStorage;
const storageKey = 'fluentcards.kindleBooks';

/**
 * @typedef {import('./kindle').Vocab} Vocab
 * @typedef {import('./kindle').Book} Book 
 * @typedef {import('./vocab-store').VocabItem} VocabItem
 * @typedef {undefined | string | Array<{ text: string }>} WordDef
 *
 * @typedef {Object} Word
 * @property {string} selection
 * @property {string} context
 * @property {WordDef} def
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
     * @type {Book[]}
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
   * Restore books from local storage.
   *
   * @see storageKey
   */
  restoreSavedBooks() {
    const savedBooks = localStorage.getItem(storageKey);
    savedBooks && this.setBooks(JSON.parse(savedBooks));
  }

  /**
   * Update books and save into local storage
   *
   * @param {Book[]} books
   */
  setBooks(books) {
    this.books = books;
    localStorage.setItem(storageKey, JSON.stringify(this.books));
  }

  /**
   * Retrieve a book by id.
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
   * Return the kindle vocabulary.
   *
   * @returns {Book[]}
   */
  getBooks() {
    return this.books;
  }

  /**
   * Update a vocabulary item in a book managed by this instance.
   *
   * @param {string} id the book id (must exist)
   * @param {VocabItem} item the item to update. Must exist. The `selection`
   *  and `context` fields are used to find the matching vocabulary item in
   *  the book.
   * @param {Partial<Vocab>} newFields the values to update
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
