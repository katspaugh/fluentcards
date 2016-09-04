import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

import {VocabService} from '../../services/vocab';
import {DictionaryService} from '../../services/dictionary';
import {TranslationService} from '../../services/translation';

@Component({
    selector: 'book',
    styleUrls: [ './book.css' ],
    templateUrl: './book.html'
})
export class Book {

    private sub: any;
    book: any;
    exportUrl: any;
    language: string;
    errorMessage: string;
    isLoadingDefinitions = false;
    isLoadingImages = false;
    hasSpeechSynthesis = window.speechSynthesis != null;
    definitionsEnabled = false;
    imagesEnabled = false;
    clozeEnabled = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private vocabService: VocabService,
        private dictionaryService: DictionaryService,
        private translationService: TranslationService
    ) {
        this.language = localStorage.getItem('language') || window.navigator.language.split('-')[0];

        window.scrollTo(0, 0);
    }

    private getExportUrl() {
        let hasTranslations = this.book.vocabs[0].translation != null;
        let hasImages = this.book.vocabs.some((vocab) => vocab.image);

        let lines = this.book.vocabs.map((vocab) => {
            let word = vocab[0];

            if (vocab.fl) {
                word += ', ' + vocab.fl;
            }

            if (vocab.gender) {
                word += ', ' + vocab.gender;
            }

            let items = [ word ];

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
                this.router.navigate([ '/books' ]);
                return;
            }

            this.book = book;
            this.exportUrl = this.getExportUrl();
        });

        document.body.classList.add('book-page');
    }

    ngOnDestroy() {
        this.sub.unsubscribe();

        document.body.classList.remove('book-page');
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

            // Try the root form
            if (cloze == context) {
                cloze = context.replace(new RegExp(vocab[0], 'g'), '{{c1::$&}}');
            }

            vocab.cloze = cloze;
        });
        this.exportUrl = this.getExportUrl();
    }

    removeCloze() {
        this.book.vocabs.forEach((vocab) => delete vocab.cloze);
        this.exportUrl = this.getExportUrl();
    }

    addDefinitions() {
        let load = (bookLanguage, index) => {
            const throttle = 100;
            let vocab = this.book.vocabs[index];

            this.dictionaryService.lookup(vocab[0], bookLanguage, this.language)
                .subscribe(
                    (data) => {
                        let def = data[0];
                        vocab.definition = def;
                        vocab.translation = def.tr[0].text;
                        vocab.gender = def.gen;
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
                setTimeout(() => load(bookLanguage, index + 1), throttle)
            } else {
                this.isLoadingDefinitions = false;
            }
        };

        this.errorMessage = null;
        this.isLoadingDefinitions = true;

        this.translationService.detectLanguage(this.book.vocabs[0][2], this.book.language)
            .subscribe(
                (lang) => load(lang, 0),
                (err) => load(this.book.language, 0)
            );
    }

    removeDefinitions() {
        this.book.vocabs.forEach((vocab) => delete vocab.translation);
        this.exportUrl = this.getExportUrl();
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
        let load = (index) => {
            const throttle = 300;

            this.book.vocabs[index].preloadImage = true;

            if (index + 1 < this.book.vocabs.length) {
                setTimeout(() => load(index + 1), throttle)
            } else {
                this.isLoadingImages = false;
            }
        };

        this.isLoadingImages = true;
        load(0);
    }

    removeImages() {
        this.book.vocabs.forEach((vocab) => delete vocab.image);
        this.exportUrl = this.getExportUrl();
    }

    removeVocab(index: number) {
        if (this.book.vocabs.length == 1) return;
        this.book.vocabs.splice(index, 1);
        this.vocabService.cacheVocabs(this.book.asin, this.book);
        this.exportUrl = this.getExportUrl();
    }

    changeDefinition(vocab) {
        let index = null;
        vocab.definition.tr.forEach((tr, idx) => {
            if (tr.text == vocab.translation) {
                index = idx;
                return false;
            }
        });
        vocab.translation = vocab.definition.tr[(index + 1) % vocab.definition.tr.length].text;
    }

    onImageAdd(data, vocab) {
        vocab.chooseImage = false;
        vocab.preloadImage = false;

        if (data.image) {
            vocab.image = data.image;
            this.exportUrl = this.getExportUrl();
        }
    }

    onLanguageSelect() {
        localStorage.setItem('language', this.language);

        this.definitionsEnabled && this.addDefinitions();
    }

    onToggleDefinitions() {
        this.definitionsEnabled ? this.addDefinitions() : this.removeDefinitions();
    }

    onToggleImages() {
        this.imagesEnabled ? this.addAllImages() : this.removeImages();
    }

    onToggleCloze() {
        this.clozeEnabled ? this.addCloze() : this.removeCloze();
    }

}
