import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {DomSanitizationService} from '@angular/platform-browser';

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
    exportUrl: any;
    language: string;
    errorMessage: string;
    isTranslationLoading = false;
    translationProgress = 0;
    hasSpeechSynthesis = window.speechSynthesis != null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizationService,
        private vocabService: VocabService,
        private translationService: TranslationService
    ) {
        this.language = localStorage.getItem('language') || window.navigator.language.split('-')[0];
    }

    private getExportUrl() {
        let hasTranslations = this.book.vocabs[0].translation;

        let lines = this.book.vocabs.map((vocab) => {
            let items = [
                vocab[0], // stem
                vocab.cloze || vocab[2] // text
            ];

            if (hasTranslations) {
                items.splice(1, 0, vocab.translation || '');
            }

            return items.join('\t');
        });

        let csv = lines.join('\n');
        let url = 'data:text/tab-separated-values;charset=utf-8,' + encodeURIComponent(csv)

        return this.sanitizer.bypassSecurityTrustUrl(url);
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
            this.exportUrl = this.getExportUrl();

            window.scrollTo(0, 0);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    addCloze() {
        this.book.vocabs.forEach((vocab) => {
            let word = vocab[1];
            let context = vocab[2];
            let cloze = context.replace(new RegExp('\\b' + word + '\\b', 'g'), '{{c1::$&}}');
            vocab.cloze = cloze;
        });
        this.exportUrl = this.getExportUrl();
    }

    addTranslations() {
        this.isTranslationLoading = true;
        this.errorMessage = null;
        this.book.vocabs.forEach((vocab) => delete vocab.translation);
        this.translationProgress = 0;

        this.translationService.translate(this.book.vocabs, this.language)
            .subscribe(
                (data) => {
                    data.translations.forEach((word, index) => {
                        this.book.vocabs[index].translation = word
                    });

                    this.book.language = data.language;
                    this.translationProgress = Math.round(data.translations.length / this.book.vocabs.length * 100);
                    this.exportUrl = this.getExportUrl();
                },
                (errMessage) => {
                    this.isTranslationLoading = false;
                    this.errorMessage = errMessage;
                },
                () => this.isTranslationLoading = false
            );
    }

    onLanguageSelect() {
        localStorage.setItem('language', this.language);
    }

    speakWord(word) {
        var speech = new window.SpeechSynthesisUtterance();
        speech.text = word;
        speech.lang = this.book.language;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
    }
}
