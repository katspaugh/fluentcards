import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ExtensionService {
  constructor(@Inject('Window') private window: Window) {}

  private transform(data) {
    const langGroups = data.reduce((acc, item) => {
      const lang = item.language;

      const vocab = {
        baseForm: item.def[0].text,
        context: item.context,
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
        asin: `extension-${ lang }`,
        id: `extension-${ lang }`,
        authors: 'Fluentcards Extension',
        count: langGroups[lang].length,
        language: lang,
        lastLookup: Date.now(),
        title: `Web Vocabulary (${ lang })`,
        vocabs: langGroups[lang]
      }));
  }

  getVocab() {
    return new Promise((resolve) => {
      let count = 100;

      const poll = setInterval(() => {
        count -= 1;

        if (window.fluentcards) {
          clearInterval(poll);

          resolve(this.transform(window.fluentcards));
        } else if (count <= 0) {
          clearInterval(poll);
        }
      }, 50);
    });
  }
};
