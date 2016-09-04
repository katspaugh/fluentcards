import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {VocabService} from '../../services/vocab';

@Component({
    selector: 'start-view',
    styleUrls: [ './start-view.css' ],
    templateUrl: './start-view.html'
})
export class StartView {

    constructor(
        private router: Router,
        private vocabService: VocabService
    ) {
        let books = this.vocabService.getBooks();

        if (books && !books.isDemo) {
            this.router.navigate([ '/books' ]);
        }
    }

}
