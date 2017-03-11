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
.ts {
  color: grey;
}
b {
  white-space: nowrap;
}
u {
  color: #999;
  text-decoration: none;
}
h1 i, h1 u {
  font-size: 0.6em;
}
`;

@Injectable()
export class ApkgService {
  constructor() {}

  private formatCard(item, language) {
    const DE = 'de';

    let baseForm = item.baseForm;
    if (item.gender && language == DE) {
      const article = { m: 'der', f: 'die', n: 'das' }[item.gender];
      baseForm = article + ' ' + baseForm;
    }
    let word = `${ baseForm }`;
    if (item.fl) word += `<br /><u>${ item.fl }</u>`;
    if (item.gender && language != DE) word += ` <i>(${ item.gender })</i>`;
    word = `<h1>${ word }</h1>`;

    let translation = item.translation ? `<hr /><h2>${ item.translation }</h2>` : '';

    const img = item.image ? `<hr /><img src="${ item.image.thumbnail }" />` : '';

    const ts = item.definition && item.definition.ts ? `<p class="ts">[${ item.definition.ts }]</p>` : '';

    const cloze = item.cloze ? item.cloze.replace(/\{\{c1::([^}]+)\}\}/g, '<b>$1</b>') : '';

    let context = item.context.replace(new RegExp('\\b(' + item.word + ')\\b', 'g'), '<b>$1</b>');
    if (context == item.context) context = context.replace(new RegExp(item.word, 'g'), '<b>$&</b>');
    if (context == item.context) context = context.replace(new RegExp(item.baseForm, 'g'), '<b>$&</b>');
    context = `<p>${ context }</p>`;

    const speech = `
<script>
    var speech = new SpeechSynthesisUtterance();
    speech.text = "${ baseForm.replace(/"/g, '\\"') }";
    speech.lang = "${ language }";
    speechSynthesis.cancel();
    speechSynthesis.speak(speech);
</script>`;

    return cloze ? {
      front: `<p class="cloze">${ cloze }</p>${ img }`,
      back: `<p>${ cloze }</p><hr />${ word }${ ts }${ translation }${ img }${ speech }`
    } : {
      front: `${ word }${ ts }<hr />${ context }${ img }${ speech }`,
      back: `${ word }${ ts }${ translation }<hr />${ context }${ img }`,
    };
  }

  createDeck(fileName, deckName, items, language) {
    const apkg = new Exporter(deckName.slice(0, 40), CardCss);

    items
      .map(item => this.formatCard(item, language))
      .forEach(item => apkg.addCard(item.front, item.back, { tags: {} }));

    apkg
      .save({})
      .then(zip => {
        saveAs(zip, `${ fileName }.apkg`);
      })
      .catch(err => { throw err; });

  }
};
