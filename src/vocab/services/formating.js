import config from '../../config';

/**
 * Get an article for a given word and language
 *
 * @param {any} data
 * @param {string} lang
 * @returns {string}
 */
export function getArticle(data, lang) {
  const { articles } = config;
  return articles[lang] ? (articles[lang][data.num] || articles[lang][data.gen]) : '';
}
