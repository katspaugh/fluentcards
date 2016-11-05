import {Component} from '@angular/core';

import {VocabService} from '../../services/vocab';

@Component({
    selector: 'books-view',
    styleUrls: [ './books-view.css' ],
    templateUrl: './books-view.html'
})
export class BooksView {
    books: any[];
    wordsCount: number;

    constructor(private vocabService: VocabService) {
        this.books = this.vocabService.getBooks();
    }

}
