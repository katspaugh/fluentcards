export function getArticle (data, lang) {
  const articles = {
    de: {
      pl: 'die',
      m: 'der',
      f: 'die',
      n: 'das'
    }
  };

  return articles[lang] ? articles[lang][data.num] || articles[lang][data.gender] : null;
};
