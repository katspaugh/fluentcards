import React from 'react';
import Header from '../../../shared/components/Header/Header.jsx';
import Words from '../Words/Words.jsx';

/**
 * WordsRoute component
 */
export default ({ match }) => {
  const { id } = match.params;

  return (
    <div>
      <Words id={ id } />
    </div>
  );
}
