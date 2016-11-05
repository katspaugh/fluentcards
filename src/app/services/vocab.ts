import {Injectable, Inject} from '@angular/core';

@Injectable()
export class VocabService {

  private db: any;
  private books: any;
  private storage: any;

  constructor(@Inject('Window') private window: Window) {
    this.storage = window.localStorage;

    this.books = JSON.parse(this.storage.getItem('books'));

    // Load demo books
    if (!this.books) {
      this.books = window.DEMO_BOOKS;
      this.books.isDemo = true;
    }
  }

  private storeBooks() {
    this.storage.setItem('books', JSON.stringify(this.books));
  }

  private findBook(asin: string) {
    if (!this.books) return null;
    return this.books.filter((book) => book.asin == asin)[0];
  }

  private queryBooks() {
    if (!this.db) return null;

    let booksQuery;
    try {
      booksQuery = this.db.exec('SELECT id, title, authors, lang, asin FROM book_info GROUP BY asin;');
    } catch (err) {
      return null;
    }

    let books = booksQuery[0].values.map((book) => {
      let escapedId = book[0].replace(/'/g, "''");
      let countQuery = this.db.exec(`SELECT COUNT(timestamp) FROM lookups WHERE book_key='${ escapedId }'`);
      let timestampQuery = this.db.exec(`SELECT timestamp FROM lookups WHERE book_key='${ escapedId }' ORDER BY timestamp DESC LIMIT 1;`);
      let asin = book[4];
      let cover = asin.length == 10 ? `http://images.amazon.com/images/P/${ asin }.01.20TRZZZZ.jpg` : '';

      return {
        id: book[0],
        title: book[1],
        authors: book[2],
        language: book[3].split('-')[0],
        asin: asin,
        cover: cover,
        count: countQuery[0].values[0][0],
        lastLookup: timestampQuery[0] ? timestampQuery[0].values[0][0] : 0
      };
    });

    books = books.filter((book) => book.count > 0);
    books.sort((a, b) => b.lastLookup - a.lastLookup); // newest first

    return books;
  }

  private queryVocabs(id: string) {
    if (!this.db) return null;

    let escapedId = id.replace(/'/g, "''");
    let vocabsQuery = this.db.exec(`
SELECT
words.stem, words.word, lookups.usage
FROM lookups
LEFT OUTER JOIN words
ON lookups.word_key=words.id
WHERE lookups.book_key='${ escapedId }';
`);

    if (!vocabsQuery[0]) return;

    return vocabsQuery[0].values.map((row) => {
      return {
        baseForm: row[0],
        word: row[1],
        context: row[2]
      };
    });
  }

  private preloadVocabs() {
    // Sequentially load vocabs for each book
    let preload = (index) => {
      if (index == this.books.length) {
        return this.storeBooks();
      }
      let book = this.books[index];
      book.vocabs = this.queryVocabs(book.id);
      setTimeout(() => preload(index + 1), 0);
    };

    preload(0);
  }

  loadBooks(uints: any) {
    this.db = new this.window.SQL.Database(uints);
    let books = this.queryBooks();

    if (!books) return null;

    this.books = books;
    this.preloadVocabs();

    return this.books;
  }

  getBooks() {
    return this.books;
  }

  getBook(asin: string) {
    let book = this.findBook(asin);

    if (book && !book.vocabs) {
      book.vocabs = this.queryVocabs(book.id);
    }

    return book;
  }

  updateBook(book) {
    book.count = book.vocabs.length;
    this.storeBooks();
  }

  removeBook(book) {
    let index = this.books.indexOf(book);
    this.books.splice(index, 1);
    this.storeBooks();
  }

};
