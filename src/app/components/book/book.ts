import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {DomSanitizationService} from '@angular/platform-browser';

import {VocabService} from '../../services/vocab';
import {DictionaryService} from '../../services/dictionary';
import {TranslationService} from '../../services/translation';
import {Loader} from '../loader/loader';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';
import {VocabImages} from '../vocab-images/vocab-images';

@Component({
    selector: 'book',
    pipes: [],
    providers: [],
    directives: [ ROUTER_DIRECTIVES, Loader, Header, Footer, VocabImages ],
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
    hasSpeechSynthesis = window.speechSynthesis != null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizationService,
        private vocabService: VocabService,
        private dictionaryService: DictionaryService,
        private translationService: TranslationService
    ) {
        this.language = localStorage.getItem('language') || window.navigator.language.split('-')[0];

        window.scrollTo(0, 0);
    }

    private getExportUrl() {
        let hasTranslations = this.book.vocabs[0].translation;
        let hasImages = this.book.vocabs.some((vocab) => vocab.image);

        let lines = this.book.vocabs.map((vocab) => {
            let items = [
                vocab[0]
            ];

            if (hasTranslations) {
                items.push(vocab.translation || '');
            }

            items.push(vocab.cloze || vocab[2]);

            if (hasImages) {
                items.push(vocab.image ? `<img src="${ vocab.image.thumbnail }" />` : '');
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

            // Languages like Japanese and Chinese don't have written word boundaries.
            if (cloze == context) {
                cloze = context.replace(new RegExp(word, 'g'), '{{c1::$&}}');
            }

            vocab.cloze = cloze;
        });
        this.exportUrl = this.getExportUrl();
    }

    addDefinitions() {
        const throttle = 100;
        this.errorMessage = null;

        let load = (index) => {
            let vocab = this.book.vocabs[index];

            this.dictionaryService.lookup(vocab[0], this.book.language, this.language)
                .subscribe(
                    (data) => {
                        console.log(data);
                        let def = data[0];
                        vocab.definition = def;
                        vocab.translation = def.tr[0].text;
                        vocab.gen = def.gen;
                        vocab.fl = def.fl;
                    },
                    (errMessage) => {
                        this.translationService.translate(vocab[1], vocab[2], this.language)
                            .subscribe(
                                (data) => vocab.translation = data,
                                (errMessage) => this.errorMessage = errMessage
                            );
                    }
                )

            if (index + 1 < this.book.vocabs.length) {
                setTimeout(() => load(index + 1), throttle)
            } else {
                this.isTranslationLoading = false;
            }
        };

        this.isTranslationLoading = true;
        load(0);
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

    addImage(vocab) {
        vocab.chooseImage = true;
    }

    addAllImages() {
        const throttle = 300;

        let load = (index) => {
            this.book.vocabs[index].preloadImage = true;

            if (index + 1 < this.book.vocabs.length) {
                setTimeout(() => load(index + 1), throttle)
            }
        };

        load(0);
    }

    removeVocab(index: number) {
        if (this.book.vocabs.length == 1) return;
        this.book.vocabs.splice(index, 1);
        this.vocabService.cacheVocabs(this.book.asin, this.book);
    }

    onImageAdd(data, vocab) {
        vocab.chooseImage = false;
        vocab.preloadImage = false;

        if (data.image) {
            vocab.image = data.image;
            this.exportUrl = this.getExportUrl();
        }
    }
}
