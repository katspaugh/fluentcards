import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {VocabService} from '../../services/vocab';
import {TranslationService} from '../../services/translation';
import {Loader} from '../loader/loader';

@Component({
    selector: 'book',
    pipes: [],
    providers: [],
    directives: [ ROUTER_DIRECTIVES, Loader ],
    styleUrls: [ './book.css' ],
    templateUrl: './book.html'
})
export class Book {

    private sub: any;
    book: any;
    language: string;
    isTranslationLoading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private vocabService: VocabService,
        private translationService: TranslationService
    ) {
        this.language = window.navigator.language.split('-')[0];
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params) => {
            let id = params['id'];
            let book = this.vocabService.getVocabs(id);

            if (!book) {
                this.router.navigate([ '/' ]);
                return;
            }

            this.book = book;

            window.scrollTo(0, 0);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    exportCsv() {
        let lines = this.book.vocabs.map((vocab) => {
            let items = vocab.slice();

            if (vocab.translation) {
                items.splice(2, 0, vocab.translation);
            }

            if (vocab.cloze) {
                items.push(vocab.cloze);
            }

            return items.join('\t');
        });
        let csv = lines.join('\n');
        window.open('data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    }

    addCloze() {
        this.book.vocabs.forEach((vocab) => {
            let word = vocab[1];
            let context = vocab[2];
            let cloze = context.replace(new RegExp('\\b' + word + '\\b', 'g'), '{{c1::$&}}');
            vocab.cloze = cloze;
        });
    }

    addTranslations() {
        this.isTranslationLoading = true;

        this.translationService.translate(this.book.vocabs, this.language)
            .subscribe((translations) => {
                this.isTranslationLoading = false;

                this.book.vocabs.forEach((vocab, index) => {
                    vocab.translation = translations[index];
                });
            });
    }
}
