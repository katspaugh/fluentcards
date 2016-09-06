import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {VocabService} from '../../services/vocab';

@Component({
    selector: 'intro-view',
    styleUrls: [ './intro-view.css' ],
    templateUrl: './intro-view.html'
})
export class IntroView {

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
