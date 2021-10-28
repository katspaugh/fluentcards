import React from 'react';
import styles from './Footer.css';

export default class Footer extends React.PureComponent {
  render() {
    return (
      <div className={ styles.container }>
        <footer>
          Fluentcards, 2017–2021
        </footer>
      </div>
    );
  }
}
