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

        let booksQuery = this.db.exec('SELECT id, title, authors FROM book_info;');

        this.books = booksQuery[0].values.map((book) => {
            let countQuery = this.db.exec(`SELECT COUNT(*) FROM lookups WHERE book_key='${ book[0] }'`);

            return {
                id: btoa(book[0]),
                title: book[1],
                authors: book[2],
                count: countQuery[0].values[0][0]
            };
        });

        return this.books;
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
        return {
            id: book.id,
            title: book.title,
            authors: book.authors,
            vocabs: vocabsQuery[0].values
        };
    }

};
