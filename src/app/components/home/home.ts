import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {VocabService} from '../../services/vocab';
import {VbDrop} from '../vb-drop/vb-drop'

@Component({
    selector: 'home',
    pipes: [],
    providers: [],
    directives: [ ROUTER_DIRECTIVES, VbDrop ],
    styleUrls: [ './home.css' ],
    templateUrl: './home.html'
})
export class Home {

    books = null;
    hasData = false;

    constructor(private vocabService: VocabService) {
        // Try getting cached books
        this.onUpload({ ok: true });
    }

    onUpload(data) {
        if (!data.ok) return;

        this.books = this.vocabService.getBooks();
        this.hasData = Boolean(this.books);
    }

}
