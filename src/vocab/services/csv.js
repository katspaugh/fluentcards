import { escapeRegexp } from '../../shared/services/Utils';
import { getArticle } from './formating';

function formatWord(item) {
  const data = item.def[0];
  const article = getArticle(data, item.language);

  let word = data.text;
  if (article) word = `${ article } ${ data.text }`;

  const extra = [ data.fl, data.num || data.gen ].filter(Boolean).join(', ');
  if (extra) word += `; ${ extra }`;

  return word;
}

function formatDefinition(item, maxDefs = 2) {
  const defintions = [];
  if (item.def && item.def[0] && item.def[0].tr) {
    item.def.forEach(def => def.tr.forEach(tr => defintions.push(tr.text)));
  }
  return defintions.slice(0, maxDefs).join('; ');
}

function formatContext(item) {
  // Context with the selection highlighted
  let parts = item.context.split(new RegExp('\\b' + escapeRegexp(item.selection) + '\\b'));
  if (parts.length === 1) {
    parts = item.context.split(item.selection);
  }
  return parts.join(`<b>${ item.selection }</b>`).replace(/\n/g, ' ');
}

function plain(item) {
  return [ formatWord(item), item.context.replace(/\n/g, ' '), formatDefinition(item) ];
}

function basic(item) {
  const word = formatWord(item);
  const ts = item.def[0].ts ? `<br /><small class="ipa">${ item.def[0].ts }</small>` : '';
  const context = `<p class="context">${ formatContext(item) }</p>`;
  return [
    // front
    `${ word }${ ts }${ context }`,
    // back
    formatDefinition(item) || context
  ];
}

function cloze(item) {
  const word = formatWord(item);
  const def = formatDefinition(item);

  let parts = item.context.split(new RegExp('\\b' + escapeRegexp(item.selection) + '\\b'));
  if (parts.length === 1) {
    parts = item.context.split(item.selection);
  }
  const cloze = parts.join(`{{c1::${ item.selection }}}`).replace(/\n/g, ' ');;

  return [ cloze, word, def ];
}

/**
 * @param {any[]} items
 * @param {string} type
 * @returns {string}
 */
export default function exportCsv(items, type) {
  let mappingFn = plain;

  if (type === 'basic') {
    mappingFn = basic;
  } else if (type === 'cloze') {
    mappingFn = cloze;
  }

  const lines = items.map(mappingFn);

  return lines.map(line => line.join('\t')).join('\n');
}
