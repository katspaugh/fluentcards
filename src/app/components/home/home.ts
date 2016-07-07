import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {VocabService} from '../../services/vocab';
import {Drop} from '../drop/drop'

@Component({
    selector: 'home',
    pipes: [],
    providers: [],
    directives: [ ROUTER_DIRECTIVES, Drop ],
    styleUrls: [ './home.css' ],
    templateUrl: './home.html'
})
export class Home {

    books = null;
    hasData = false;

    constructor(private vocabService: VocabService) {
        window.scrollTo(0, 0);

        // Try getting cached books
        this.onUpload({ ok: true });
    }

    onUpload(data) {
        if (!data.ok) return;

        this.books = this.vocabService.getBooks();
        this.hasData = Boolean(this.books);

        this.hasData && setTimeout(() => this.preload(), 300);
    }

    preload() {
        this.books.forEach((book) => this.vocabService.getVocabs(book.id));
    }

    truncateWords(text, wordsCount) {
        const delim = ' ';
        let words = text.split(delim);
        let ellipsis = words.length > wordsCount ? '…' : '';
        return words.slice(0, wordsCount).join(delim) + ellipsis;
    }

}
