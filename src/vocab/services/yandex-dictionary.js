const apiKeys = [
  'ZGljdC4xLjEuMjAxNTA4MTdUMDgxMTAzWi43YWM4YTUzODk0OTFjYTE1LjkxNjQwNjQwNzEyM2Y2MDlmZDBiZjkzYzEyMjE5MGQ1NmFmNjM1OWM=',
  'ZGljdC4xLjEuMjAxNDA4MTBUMTgwODQyWi40YzA1ZmEyMzkyOWQ4OTFiLjA5Y2QzOTUyZDQ4Njk2YzYzOWIxNjRhNzcxZjY5NDU2N2IwNGJkZWY=',
  'ZGljdC4xLjEuMjAxNDExMjJUMTIwMzA2Wi40ZTQ2NzY1ZGQyMDYwMTBhLjNlNGExYjE4MmRmNWQ4OTJmZDc0ZGQzZTQ0ZjM4OWIwZTVhZWVhMjQ='
];

const endpoint = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?&flags=4';

// eslint-disable-next-line
const langs = [ 'be-be','be-ru','bg-ru','cs-en','cs-ru','da-en','da-ru','de-de','de-en','de-ru','de-tr','el-en','el-ru','en-cs','en-da','en-de','en-el','en-en','en-es','en-et','en-fi','en-fr','en-it','en-lt','en-lv','en-nl','en-no','en-pt','en-ru','en-sk','en-sv','en-tr','en-uk','es-en','es-es','es-ru','et-en','et-ru','fi-en','fi-ru','fr-en','fr-fr','fr-ru','it-en','it-it','it-ru','lt-en','lt-ru','lv-en','lv-ru','nl-en','nl-ru','no-en','no-ru','pl-ru','pt-en','pt-ru','ru-be','ru-bg','ru-cs','ru-da','ru-de','ru-el','ru-en','ru-es','ru-et','ru-fi','ru-fr','ru-it','ru-lt','ru-lv','ru-nl','ru-no','ru-pl','ru-pt','ru-ru','ru-sk','ru-sv','ru-tr','ru-tt','ru-uk','sk-en','sk-ru','sv-en','sv-ru','tr-de','tr-en','tr-ru','tt-ru','uk-en','uk-ru','uk-uk' ];

const defaultLang = 'en';

/**
 * Download a dictionary definition of a word
 *
 * @param {string} text
 * @param {string} lang
 * @param {string} targetLang
 * @returns {promise}
 */
export default function yandexDefine(text, lang, targetLang) {
  let langPair = `${ lang }-${ targetLang }`;

  if (!langs.includes(langPair)) {
    langPair = `${ defaultLang }-${ targetLang }`;
  }

  if (!langs.includes(langPair)) {
    langPair = `${ defaultLang }-${ defaultLang }`;
  }

  if (!langs.includes(langPair)) {
    return Promise.reject('Missing language pair');
  }

  const url = [
    endpoint,
    'key=' + atob(apiKeys[~~(Math.random() * apiKeys.length)]),
    'lang=' + langPair,
    'text=' + encodeURIComponent(text)
  ].join('&');

  return fetch(url)
    .then(resp => resp.json())
    .then(data => {
      if (data && data.def && data.def.length) return data;

      return {
        def: [
          {
            text: text, pos: "verb", ts: "-", tr: [
              {text: "?", pos: "verb"}
            ]
          }
        ]
      }  
    });
}
