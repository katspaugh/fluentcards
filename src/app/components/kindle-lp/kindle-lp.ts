import {Component, ViewEncapsulation} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {HostListener} from '@angular/core';

import {VocabService} from '../../services/vocab';
import {KindleFrame} from '../kindle-frame/kindle-frame';
import {MacFrame} from '../mac-frame/mac-frame';
import {Drop} from '../drop/drop';

@Component({
    selector: 'kindle-lp',
    pipes: [],
    providers: [],
    directives: [ ROUTER_DIRECTIVES, KindleFrame, MacFrame, Drop ],
    styleUrls: [ './kindle-lp.css' ],
    templateUrl: './kindle-lp.html',
    encapsulation: ViewEncapsulation.None
})
export class KindleLp {
    private steps = [
        1, 2, 3
    ];

    step: number = 1;

    constructor(
        private router: Router,
        private vocabService: VocabService
    ) {
        this.loadBooks();
    }

    nextStep() {
        if (this.step == this.steps.length) return;

        let index = this.steps.indexOf(this.step);
        this.step = this.steps[(index + 1) % this.steps.length];
    }

    prevStep() {
        if (this.step == 1) return;

        let index = this.steps.indexOf(this.step);
        this.step = this.steps[(index - 1) % this.steps.length];
    }

    @HostListener('document:keyup', [ '$event' ])
    onKeyup(event) {
        if (event.code == 'ArrowLeft') {
            this.prevStep();
            event.preventDefault();
        } else if (event.code == 'ArrowRight') {
            this.nextStep();
            event.preventDefault();
        }
    }

    loadBooks() {
        let books = this.vocabService.getBooks();
        if (books && !books.isDemo) {
            this.router.navigate([ '/books' ]);
        }
    }

    onUpload(event) {
        if (!event.ok) return;
        this.vocabService.init(event.data);
        this.loadBooks();
    }
}
