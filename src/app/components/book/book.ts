import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/map';

import { VocabService } from '../../services/vocab';
import { DefinitionsService } from '../../services/definitions';
import { SpeechService } from '../../services/speech';
import { ApkgService } from '../../services/apkg';
import { CsvService } from '../../services/csv';
import { getArticle } from '../../services/text-utils';

@Component({
  selector: 'book',
  styleUrls: [ './book.css' ],
  templateUrl: './book.html'
})
export class Book {

  private sub: any;
  book: any;
  language: string;
  errorMessage: string;
  isLoadingDefinitions = false;
  isLoadingImages = false;
  hasSpeechSynthesis = window.speechSynthesis != null;
  hasSaveAs = window.saveAs != null;
  isShareable = false;
  definitionsEnabled = false;
  imagesEnabled = false;
  clozeEnabled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private vocabService: VocabService,
    private definitionsService: DefinitionsService,
    private speechService: SpeechService,
    private apkgService: ApkgService,
    private csvService: CsvService
  ) {
    this.language = localStorage.getItem('language') || window.navigator.language.split('-')[0];

    window.scrollTo(0, 0);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.vocabService.getBook(params['slug'])
        .subscribe(book => {
          if (!book) {
            this.router.navigate([ '/books' ]);
            return;
          }

          this.book = book;
          this.definitionsEnabled = book.vocabs.every((vocab) => vocab.translation);
          this.imagesEnabled = book.vocabs.every((vocab) => vocab.image);
          this.clozeEnabled = book.vocabs.every((vocab) => vocab.cloze);
          this.isShareable = !!this.vocabService.findBook(this.book.slug);
        });
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
    this.vocabService.updateBook(this.book);
  }

  removeCloze() {
    this.book.vocabs.forEach((vocab) => delete vocab.cloze);
    this.vocabService.updateBook(this.book);
  }

  processDefinition(data) {
    let vocab = data.vocab;
    vocab.translation = data.translation;
    vocab.reading = data.reading;

    if (data.definition) {
      vocab.definition = data.definition;
      vocab.reading = data.reading || data.definition.ts;
      vocab.translation = data.definition.tr.slice(0, 2).map(t => t.text).join('; ') || data.translation;
      vocab.definition = data.definition;
      vocab.num = data.num;
      vocab.gender = data.gender;
      vocab.article = getArticle(vocab, this.book.language);
    } else {
      delete vocab.definition;
    }

    return vocab;
  }

  addDefinitions() {
    this.isLoadingDefinitions = true;

    this.definitionsService.load(this.book.vocabs, this.book.language, this.language)
      .subscribe(
        (data: any) => this.processDefinition(data),

        (err) => null,

        () => {
          this.isLoadingDefinitions = false;
          this.vocabService.updateBook(this.book);
        }
      );
  }

  removeDefinitions() {
    this.book.vocabs.forEach((vocab) => delete vocab.translation);
    this.vocabService.updateBook(this.book);
  }

  speakWord(word) {
    this.speechService.speak(word, this.book.language);
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
    this.vocabService.updateBook(this.book);
  }

  removeVocab(index: number) {
    if (this.book.vocabs.length == 1) return;
    this.book = this.vocabService.removeVocab(this.book, index);
  }

  onImageAdd(data, vocab) {
    vocab.chooseImage = false;
    vocab.preloadImage = false;

    if (data.image) {
      vocab.image = data.image;
      this.vocabService.updateBook(this.book);
    }
  }

  onBaseFormChange(vocab, text) {
    vocab.baseForm = text;

    if (!vocab.translation) {
      this.vocabService.updateBook(this.book);
      return;
    }

    this.definitionsService.load([ vocab ], this.book.language, this.language)
      .subscribe(
        (data: any) => this.processDefinition(data),

        (err) => null,

        () => {
          this.isLoadingDefinitions = false;
          this.vocabService.updateBook(this.book);
        }
      );
  }

  onTranslationChange(vocab, text) {
    vocab.translation = text;
    this.vocabService.updateBook(this.book);
  }

  onContextChange(vocab, text) {
    if (vocab.cloze) {
      vocab.cloze = text;
      vocab.context = text.replace(/\{\{c1::(.+?)\}\}/g, '$1');
    } else {
      vocab.context = text;
    }

    this.vocabService.updateBook(this.book);
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

  exportAnki() {
    this.apkgService.createDeck(
      `fluentcards-${ this.book.asin }`,
      this.book.title,
      this.book.vocabs,
      this.book.language
    );
  }

  exportCsv() {
    this.csvService.exportCsv(
      this.book.asin,
      this.book.title,
      this.book.vocabs
    );
  }

  shareVocab() {
    this.vocabService.share(this.book)
      .subscribe(() => null);
  }

}
