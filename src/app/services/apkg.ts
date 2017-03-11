import { Injectable } from '@angular/core';
import Exporter from './anki-exporter';

const CardCss = `
.card {
  font-family: Helvetical, Arial, sans-serif;
  font-size: 20px;
  text-align: center;
  color: #333;
}
.cloze b {
  display: inline-block;
  color: transparent;
  line-height: 0.4em;
  border-bottom: 3px dotted orange;
  box-sizing: border-box;
}
`;

@Injectable()
export class ApkgService {
  constructor() {}

  private formatCard(item) {
    const img = item.image ? `<hr /><img src="${ item.image.thumbnail }" />` : '';
    const ts = item.definition && item.definition.ts ? `<p style="color: grey">[${ item.definition.ts }]</p>` : '';
    const cloze = item.cloze ? item.cloze.replace(/\{\{c1::([^}]+)\}\}/g, '<b>$1</b>') : '';

    let context = item.context.replace(new RegExp('\\b(' + item.word + ')\\b', 'g'), '<b>$1</b>');
    if (context == item.context) {
      context = context.replace(new RegExp(item.word, 'g'), '<b>$&</b>');
    }

    return cloze ? {
      front: `<p class="cloze">${ cloze }</p>${ img }`,
      back: `<p>${ cloze }</p><hr /><h1>${ item.baseForm }</h1>${ ts }<hr /><h2>${ item.translation || '' }</h2>${ img }`
    } : {
      front: `<h1>${ item.baseForm }</h1>${ ts }<hr /><p>${ context }</p>${ img }`,
      back: `<h1>${ item.baseForm }</h1>${ ts }<hr /><h2>${ item.translation || '' }</h2><hr /><p>${ context }</p>${ img }`,
    };
  }

  createDeck(fileName, deckName, items) {
    const apkg = new Exporter(deckName.slice(0, 40), CardCss);

    items
      .map(item => this.formatCard(item))
      .forEach(item => apkg.addCard(item.front, item.back, { tags: {} }));

    apkg
      .save({})
      .then(zip => {
        saveAs(zip, `${ fileName }.apkg`);
      })
      .catch(err => { throw err; });

  }
};
