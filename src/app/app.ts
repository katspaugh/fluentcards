import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

import {VocabService} from './services/vocab';

const FILE_ERROR = 'Error reading the file';
const DATA_ERROR = 'No vocabulary found in the file';
const REDIRECT_URL = '/books';

@Component({
    selector: 'app',
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

    onUpload(event) {
        this.errorMessage = '';

        if (!event.ok) {
            this.errorMessage = FILE_ERROR;
            return;
        }

        this.vocabService.loadDb(event.data);
        let books = this.vocabService.loadBooks();

        if (!books) {
            return this.errorMessage = DATA_ERROR;
        }

        if (!books.isDemo) {
            this.router.navigate([ REDIRECT_URL, Math.random() ]);
        }
    }
}
