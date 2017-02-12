import { Injectable } from '@angular/core';
import Exporter from './anki-exporter';

@Injectable()
export class ApkgService {
  constructor() {}

  private formatCard(item) {
    const img = item.image ? `<p><img src="${ item.image.thumbnail }" /></p>` : '';
    const ts = item.definition.ts ? `<p style="color: grey">[${ item.definition.ts }]</p>` : '';

    return {
      front: `<h1>${ item.baseForm }</h1>${ ts }<hr /><p>${ item.context }</p>${ img }`,
      back: `<h1>${ item.baseForm }</h1><hr /><h2>${ item.translation }</h2>`
    };
  }

  createDeck(fileName, deckName, items) {
    const saveAs = require('file-saver').saveAs;
    const template = require('../../data/sql-template').default;
    const apkg = new Exporter(deckName, template);

    items
      .map(item => this.formatCard(item))
      .forEach(item => apkg.addCard(item.front, item.back, { tags: {} }));

    apkg
      .save({})
      .then(zip => {
        saveAs(zip, `${ fileName }.apkg`);
      })
      .catch(err => console.log(err.stack || err));

  }
};
