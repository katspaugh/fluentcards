import {Component, ViewEncapsulation} from '@angular/core';
import {Router, Event, NavigationEnd} from '@angular/router';

import {VocabService} from './services/vocab';

const FILE_ERROR = 'Error reading the file';
const DATA_ERROR = 'No vocabulary found in the file';

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
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                try {
                    window.ga('set', 'page', event.urlAfterRedirects);
                    window.ga('send', 'pageview');
                } catch (e) {}
            }
        });
    }

    onUpload(event) {
        this.errorMessage = '';

        if (!event.ok) {
            this.errorMessage = FILE_ERROR;
            return;
        }

        let books = this.vocabService.loadBooks(event.data);

        if (!books) {
            return this.errorMessage = DATA_ERROR;
        }

        if (!books.isDemo) {
            this.router.navigate([ '/books', Math.random() ]);
        }
    }
}
