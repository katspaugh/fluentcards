import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import 'rxjs/add/operator/map';

import {VocabService} from '../../services/vocab';
import {DefinitionsService} from '../../services/definitions';

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
        private definitionsService: DefinitionsService
    ) {
        this.language = localStorage.getItem('language') || window.navigator.language.split('-')[0];

        window.scrollTo(0, 0);
    }

    private getExportUrl() {
        let hasTranslations = this.book.vocabs[0].translation != null;
        let hasImages = this.book.vocabs.some((vocab) => vocab.image);

        let lines = this.book.vocabs.map((vocab) => {
            let word = vocab.word;

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

            items.push(vocab.cloze || vocab.context);

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
            let asin = params['id'];
            let book = this.vocabService.getBook(asin);

            if (!book) {
                this.router.navigate([ '/books' ]);
                return;
            }

            this.book = book;
            this.definitionsEnabled = book.vocabs.every((vocab) => vocab.translation);
            this.imagesEnabled = book.vocabs.every((vocab) => vocab.image);
            this.clozeEnabled = book.vocabs.every((vocab) => vocab.cloze);
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
            let word = vocab.word;
            let context = vocab.context;
            let cloze = context.replace(new RegExp('\\b' + word + '\\b', 'g'), '{{c1::$&}}');

            // Languages like Japanese and Chinese don't have written word boundaries.
            if (cloze == context) {
                cloze = context.replace(new RegExp(word, 'g'), '{{c1::$&}}');
            }

            // Try the root form
            if (cloze == context) {
                cloze = context.replace(new RegExp(vocab.baseForm, 'g'), '{{c1::$&}}');
            }

            vocab.cloze = cloze;
        });
        this.exportUrl = this.getExportUrl();
        this.vocabService.updateBook(this.book);
    }

    removeCloze() {
        this.book.vocabs.forEach((vocab) => delete vocab.cloze);
        this.exportUrl = this.getExportUrl();
        this.vocabService.updateBook(this.book);
    }

    addDefinitions() {
        this.isLoadingDefinitions = true;

        let sub = this.definitionsService.load(this.book.vocabs, this.book.language, this.language)
            .map((data) => {
                let vocab = data.vocab;
                vocab.translation = data.translation;

                if (data.definition) {
                    vocab.definition = data.definition;
                    vocab.gender = data.gender;
                    vocab.fl = data.fl;
                } else {
                    delete vocab.definition;
                }

                this.exportUrl = this.getExportUrl();
            })
            .subscribe(() => {
                this.isLoadingDefinitions = false;
                this.vocabService.updateBook(this.book);
                sub.unsubscribe();
            });
    }

    removeDefinitions() {
        this.book.vocabs.forEach((vocab) => delete vocab.translation);
        this.exportUrl = this.getExportUrl();
        this.vocabService.updateBook(this.book);
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
        this.vocabService.updateBook(this.book);
    }

    removeVocab(index: number) {
        if (this.book.vocabs.length == 1) return;
        this.book.vocabs.splice(index, 1);
        this.exportUrl = this.getExportUrl();
        this.vocabService.updateBook(this.book);
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
            this.vocabService.updateBook(this.book);
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
