import { Injectable } from '@angular/core';

@Injectable()
export class KindleService {

  private db: any;

  initDb(uints) {
    const SQL = require('../../../node_modules/sql.js/js/sql.js');
    this.db = new SQL.Database(uints);
  }

  queryBooks() {
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

  queryVocabs(id: string) {
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
};
