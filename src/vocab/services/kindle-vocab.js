import config from '../../config';

const localStorage = window.localStorage;
const storageKey = 'fluentcards.kindleBooks';


class KindleVocab {
  constructor() {
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
   * Update books  and save into the storage
   */
  setBooks(books) {
    this.books = books;
    localStorage.setItem(storageKey, JSON.stringify(this.books));
  }

  /**
   * Get a book by id
   *
   * @param {string} id
   * @returns {any}
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
          selection: item.selection,
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
   * @returns {array}
   */
  getBooks() {
    return this.books;
  }

  /**
   * Update a vocabulary item
   *
   * @param {any} item
   * @param {any} newFields
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
