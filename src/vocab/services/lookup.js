import yandexDefine from './yandex-dictionary.js';
import wordsApiDefine from './words-api.js';

const load = (word, lang, targetLang) => {
  return (lang == 'en' && targetLang == 'en') ?
    wordsApiDefine(word).catch(() => yandexDefine(word, lang, targetLang)) :
    yandexDefine(word, lang, targetLang);
}

export function lookup(word, lang, targetLang='en') {
  return load(word, lang, targetLang);
}
