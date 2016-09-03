import {Component} from '@angular/core';
import {DomSanitizationService} from '@angular/platform-browser';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {VocabService} from '../../services/vocab';


@Component({
    selector: 'book-list',
    pipes: [],
    providers: [],
    directives: [ ROUTER_DIRECTIVES ],
    styleUrls: [ './book-list.css' ],
    templateUrl: './book-list.html'
})
export class BookList {
    books: any[];

    private randomGradient() {
        return this.sanitization.bypassSecurityTrustStyle(
            'linear-gradient(to bottom, hsl(' + Math.random() * 360 +
                ', 80%, 80%) 0%, hsl(' + Math.random() * 360 + ', 80%, 80%) 100%)'
        );
    }

    constructor(private sanitization: DomSanitizationService, private vocabService: VocabService) {
        this.books = this.vocabService.getBooks();

        this.books.forEach((book) => book.gradient = this.randomGradient());
    }

    truncateWords(text, wordsCount) {
        const delim = ' ';
        let words = text.split(delim);
        let ellipsis = words.length > wordsCount ? '…' : '';
        return words.slice(0, wordsCount).join(delim) + ellipsis;
    }

}
