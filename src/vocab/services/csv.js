import { escapeRegexp } from '../../shared/services/utils';
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
  item.def.forEach(item => item.tr.forEach(tr => defintions.push(tr.text)));
  return defintions.slice(0, maxDefs).join('; ');
}


function plain(item) {
  return [ formatWord(item), formatDefinition(item), item.context ];
}

function basic(item) {
  const word = formatWord(item);
  const def = formatDefinition(item);

  let parts = item.context.split(new RegExp('\\b' + escapeRegexp(item.selection) + '\\b'));
  if (parts.length === 1) {
    parts = item.context.split(item.selection);
  }
  const context = `<p>${ parts.join(`<b>${ item.selection }</b>`) }</p>`;

  return [ word, [ def, context ].join('<br />') ];
}

function cloze(item) {
  const word = formatWord(item);
  const def = formatDefinition(item);

  let parts = item.context.split(new RegExp('\\b' + escapeRegexp(item.selection) + '\\b'));
  if (parts.length === 1) {
    parts = item.context.split(item.selection);
  }
  const cloze = parts.join(`{{c1::${ item.selection }}}`);

  return [ cloze, def, word ];
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
