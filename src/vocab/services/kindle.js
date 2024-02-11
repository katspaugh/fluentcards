/**
 * @typedef {Object} Vocab a vocabulary entry in the database
 * @property {string} baseForm word stem
 * @property {string} selection the word as highlighted on the device
 * @property {string} context word context
 * @property {string | any[]} [def] definition
 * @property {boolean} [_removed]
 *
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} title
 * @property {string} authors
 * @property {string} language
 * @property {string} asin
 * @property {string} cover an image URL
 * @property {number} count
 * @property {number} lastLookup
 * @property {Vocab[]} [vocabs] `undefined` until the vocab items are resolved.
 */

export default class KindleService {
  constructor() {
    this.SQL = null;
    this.db = null;
  }

  init() {
    const sqlJsUrl = 'vendor/sql-memory-growth.js';

    return fetch(sqlJsUrl)
      .then(resp => resp.text())
      .then(script => {
        this.SQL = (new Function(script + '; return SQL'))();
      });
  }

  loadDb(uints) {
    this.db = new this.SQL.Database(uints);
  }

  /**
   * Fetch books from the database, sorted by the last lookup time in
   * descending order.
   *
   * @returns {Book[]} the books in the database.
   */
  queryBooks() {
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
      let slugQuery = this.db.exec(`SELECT lookups.id FROM lookups WHERE lookups.book_key='${ escapedId }' LIMIT 1`);

      // A book without look-ups
      if (!slugQuery.length) return null;

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

    books = books.filter(Boolean);
    books.sort((a, b) => b.lastLookup - a.lastLookup); // newest first

    return books;
  }

  /**
   * Retrieve the vocabulary entries associated with a book id.
   * @param id the book id
   * @return {Vocab}
   */
  queryVocabs(id) {
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
        selection: row[1],
        context: row[2]
      };
    }).filter(item => item.selection);
  }
};
