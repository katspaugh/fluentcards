import {Injectable} from '@angular/core';

@Injectable()
export class VocabService {
    private db: any;
    private books: any[];

    constructor() {}

    init(uints: any) {
        this.db = new window.SQL.Database(uints);
    }

    getBooks() {
        if (!this.db) return this.books;

        let booksQuery = this.db.exec('SELECT id, title, authors, asin FROM book_info;');

        let books = booksQuery[0].values.map((book) => {
            let escapedId = book[0].replace(/'/g, "''");
            let countQuery = this.db.exec(`SELECT COUNT(*) FROM lookups WHERE book_key='${ escapedId }'`);
            let isbn = book[3];
            let cover = isbn ? `http://images.amazon.com/images/P/${ isbn }.01.20TRZZZZ.jpg` : '';

            return {
                id: isbn || btoa(book[0]),
                cover: cover,
                title: book[1],
                authors: book[2],
                isbn: book[3],
                count: countQuery[0].values[0][0]
            };
        });

        books = books.filter((book) => book.count > 0);

        // Cache
        this.books = books;

        return books;
    }

    getVocabs(id: string) {
        let book = this.books && this.books.filter((book) => book.id == id)[0];

        if (!book) return;

        let escapedTitle = book.title.replace(/'/g, "''");
        let vocabsQuery = this.db.exec(
`
        SELECT
        words.stem, words.word, lookups.usage
        FROM lookups
        LEFT OUTER JOIN book_info
        ON lookups.book_key=book_info.id
        LEFT OUTER JOIN words
        ON lookups.word_key=words.id
	WHERE title='${ escapedTitle }';
`
        );

        if (!vocabsQuery[0]) return;

        return {
            id: book.id,
            title: book.title,
            authors: book.authors,
            vocabs: vocabsQuery[0].values
        };
    }

};
