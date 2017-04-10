import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VocabService } from '../../services/vocab';
import { MassTranslationService } from '../../services/mass-translation';
import { randomGradient } from '../../services/gradient';

@Component({
  selector: 'import-view',
  styleUrls: [ './import-view.css' ],
  templateUrl: './import-view.html'
})
export class ImportView {

  placeholder = [
    'interim',
    'conscientious',
    'barred',
    'insular',
    'moot',
    'libel',
    'expound'
  ].join('\n');

  titlePlaceholder = `Word list (${ new Date().toLocaleDateString() })`;

  private title = '';
  private text = '';
  private lines = [];

  constructor(
    private router: Router,
    private vocabService: VocabService,
    private translationService: MassTranslationService
  ) {}

  onTitleInput($event) {
    this.title = $event.target.value.trim();
  }

  onInput($event) {
    this.text = $event.target.value.trim();

    this.lines = this.text.split(/[\n\r]+/g)
      .map(line => line.split(/[\t;]/));

    // Adjust the textarea size
    $event.target.rows = Math.max(9, this.lines.length);
  }

  onSubmit($event) {
    $event.preventDefault();

    if (!this.lines.length) return;

    this.translationService.detectLanguage(this.text)
      .subscribe(lang => {
        const id = btoa(Math.random().toString(32).slice(2));

        this.vocabService.createBook({
          slug: id,
          id: `plaintext-${ id }`,
          asin: `plaintext-${ id }`,
          authors: 'Fluentcards',
          count: this.lines.length,
          language: lang,
          lastLookup: Date.now(),
          title: this.title || this.titlePlaceholder,
          gradient: randomGradient(),

          vocabs: this.lines.map(line => ({
            baseForm: line[0],
            word: line[0],
            context: line[1] || ''
          }))
        });

        this.router.navigate([ '/books', id ]);
      });
  }
}
