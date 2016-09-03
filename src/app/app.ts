import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

import {Header} from './components/header/header';
import {Footer} from './components/footer/footer';
import {Drop} from './components/drop/drop';

import {VocabService} from './services/vocab';


const FILE_ERROR = 'Error reading the file';
const DATA_ERROR = 'No vocabulary found in the file';


@Component({
    selector: 'app',
    directives: [ Header, Footer, Drop ],
    templateUrl: './app.html',
    styleUrls: [ './app.css' ],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    errorMessage: string;

    constructor(
        private router: Router,
        private vocabService: VocabService
    ) {}

    private preload(books) {
        books.forEach((book) => this.vocabService.getVocabs(book.asin));
    }

    onUpload(event) {
        this.errorMessage = '';

        if (!event.ok) {
            this.errorMessage = FILE_ERROR;
            return;
        }

        this.vocabService.init(event.data);
        let books = this.vocabService.getBooks();

        if (books && !books.isDemo) {
            setTimeout(() => this.preload(books), 300);
            this.router.navigate([ '/books' ]);
            return;
        }

        this.errorMessage = DATA_ERROR;
    }
}
