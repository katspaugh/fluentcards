import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/timeout';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ExtensionService {
  constructor(@Inject('Window') private window: Window) {}

  private transform(data) {
    // @FIXME
    data.slug = Math.random().toString(32).slice(2);

    const langGroups = data.reduce((acc, item) => {
      const lang = item.language;

      const vocab = {
        baseForm: item.def[0].text,
        context: `${ item.context }`,
        definition: item.def[0],
        translation: item.def[0].tr[0].text,
        word: item.selection
      };

      acc[lang] = acc[lang] || [];
      acc[lang].push(vocab);
      return acc;
    }, {});

    return Object.keys(langGroups)
      .map((lang) => ({
        slug: `${ data.slug }`,
        id: `extension-${ lang }`,
        asin: `extension-${ lang }`,
        authors: 'Fluentcards Extension',
        count: langGroups[lang].length,
        language: lang,
        lastLookup: Date.now(),
        title: `Web Vocabulary (${ lang.toUpperCase() })`,
        vocabs: langGroups[lang]
      }));
  }

  getVocab() {
    return Observable.interval(50)
      .filter(() => window.fluentcards)
      .take(1)
      .map(() => this.transform(window.fluentcards))
      .timeout(30000);
  }
};
