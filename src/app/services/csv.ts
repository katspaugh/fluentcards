import { Injectable } from '@angular/core';

@Injectable()
export class CsvService {
  constructor() {}

  exportCsv(fileName, deckName, items) {
    let hasTranslations = items[0].translation != null;
    let hasImages = items.some((vocab) => vocab.image);

    let lines = items.map((vocab) => {
      let word = vocab.baseForm;

      if (vocab.article) {
        word = vocab.article + ' ' + word;
      }

      if (vocab.fl) {
        word += ', ' + vocab.fl;
      }

      if (vocab.num || (vocab.gender && !vocab.article)) {
        word += ', ' + vocab.num || vocab.gender;
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

    window.open(url, deckName);
  }
};
