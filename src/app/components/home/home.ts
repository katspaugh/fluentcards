import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {VocabService} from '../../services/vocab';
import {Drop} from '../drop/drop';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';


const FILE_ERROR = 'Error reading the file';
const DATA_ERROR = 'No vocabulary found in the file';

@Component({
    selector: 'home',
    pipes: [],
    providers: [],
    directives: [ ROUTER_DIRECTIVES, Drop, Header, Footer ],
    styleUrls: [ './home.css' ],
    templateUrl: './home.html'
})
export class Home {

    books = null;
    errorMessage = '';
    dropAreaVisible = true;

    constructor(private vocabService: VocabService) {
        window.scrollTo(0, 0);

        // Try getting cached books
        this.books = this.vocabService.getBooks();

        if (this.books && !this.books.isDemo) {
            this.dropAreaVisible = false;
        }
    }

    private preload() {
        this.books.forEach((book) => this.vocabService.getVocabs(book.asin));
    }

    onUpload(event) {
        if (!event.ok) {
            this.errorMessage = FILE_ERROR;
            return;
        }

        this.vocabService.init(event.data);
        this.books = this.vocabService.getBooks();

        if (!this.books) {
            this.errorMessage = DATA_ERROR;
            return;
        }

        this.dropAreaVisible = false;
        setTimeout(() => this.preload(), 300);
    }

    truncateWords(text, wordsCount) {
        const delim = ' ';
        let words = text.split(delim);
        let ellipsis = words.length > wordsCount ? '…' : '';
        return words.slice(0, wordsCount).join(delim) + ellipsis;
    }

}
