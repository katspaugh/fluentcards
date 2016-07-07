import {Injectable} from '@angular/core';

@Injectable()
export class VocabService {
    private db: any;
    private books: any[];
    private vocabs: any;

    constructor() {
        this.books = JSON.parse(sessionStorage.getItem('books'));
        this.vocabs = JSON.parse(sessionStorage.getItem('vocabs')) || {};
    }

    init(uints: any) {
        this.db = new window.SQL.Database(uints);
    }

    cacheBooks(books) {
        this.books = books;

        setTimeout(() => {
            sessionStorage.setItem('books', JSON.stringify(this.books));
        }, 100);
    }

    cacheVocabs(asin, vocabs) {
        this.vocabs[asin] = vocabs;

        setTimeout(() => {
            sessionStorage.setItem('vocabs', JSON.stringify(this.vocabs));
        }, 100);
    }

    getBooks() {
        if (!this.db) return this.books;

        let booksQuery = this.db.exec('SELECT id, title, authors, asin FROM book_info GROUP BY asin;');

        let books = booksQuery[0].values.map((book) => {
            let escapedId = book[0].replace(/'/g, "''");
            let countQuery = this.db.exec(`SELECT COUNT(timestamp) FROM lookups WHERE book_key='${ escapedId }'`);
            let timestampQuery = this.db.exec(`SELECT timestamp FROM lookups WHERE book_key='${ escapedId }' ORDER BY timestamp DESC LIMIT 1;`);
            let asin = book[3];
            let cover = asin.length == 10 ? `http://images.amazon.com/images/P/${ asin }.01.20TRZZZZ.jpg` : '';

            return {
                id: book[0],
                title: book[1],
                authors: book[2],
                asin: asin,
                cover: cover,
                count: countQuery[0].values[0][0],
                lastLookup: timestampQuery[0] ? timestampQuery[0].values[0][0] : 0
            };
        });

        books = books.filter((book) => book.count > 0);
        books.sort((a, b) => b.lastLookup - a.lastLookup); // newest first

        this.cacheBooks(books);

        return books;
    }

    getVocabs(asin: string) {
        if (!this.db) return this.vocabs[asin];

        let book = this.books && this.books.filter((book) => book.asin == asin)[0];
        if (!book) return;

        let escapedId = book.id.replace(/'/g, "''");
        let vocabsQuery = this.db.exec(
`
        SELECT
        words.stem, words.word, lookups.usage
        FROM lookups
        LEFT OUTER JOIN words
        ON lookups.word_key=words.id
        WHERE lookups.book_key='${ escapedId }';
`
        );

        if (!vocabsQuery[0]) return;

        let vocabs = {
            title: book.title,
            authors: book.authors,
            asin: book.asin,
            cover: book.cover,
            count: book.count,
            vocabs: vocabsQuery[0].values
        };

        this.cacheVocabs(asin, vocabs);

        return vocabs;
    }

};
