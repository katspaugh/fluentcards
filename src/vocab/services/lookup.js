import yandexDefine from './yandex-dictionary.js';
import wordsApiDefine from './words-api.js';

/**
 * Load the definition of a word, potentially trying different APIs.
 *
 * @returns {promise} A promise that either contains an object with information
 * about the definition or null if the word was not found.
 */
const load = (word, lang, targetLang) => {
  return (lang == 'en' && targetLang == 'en') ?
    wordsApiDefine(word).catch(() => yandexDefine(word, lang, targetLang)) :
    yandexDefine(word, lang, targetLang).catch(() => null);
};

export function lookup(word, lang, targetLang='en') {
  return load(word, lang, targetLang);
}
