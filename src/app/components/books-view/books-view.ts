import {Component} from '@angular/core';

import {VocabService} from '../../services/vocab';
import {BookList} from '../book-list/book-list';

@Component({
    selector: 'books-view',
    directives: [ BookList ],
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
