const endpoint = 'https://dphk13sebjka5.cloudfront.net';

/**
 * Download a definition of a word
 *
 * @param {string} word
 * @returns {promise}
 */
export default function getDefinition(word) {
  return fetch(`${ endpoint }/${ word }`)
    .then(resp => resp.json())
    .then(data => ({
      def: data.results
        .reduce((acc, next) => {
          const prev = acc[acc.length - 1];

          if (prev && prev.partOfSpeech === next.partOfSpeech) {
            prev.definition.push(next.definition);
          } else {
            next.definition = [ next.definition ];
            acc.push(next);
          }

          return acc;
        }, [])
        .map(result => ({
          text: data.word,
          ts: data.pronunciation ?
            data.pronunciation[result.partOfSpeech] || data.pronunciation.all :
            '',
          tr: result.definition.map(text => ({ text })),
          pos: result.partOfSpeech
        }))
    }));
};
