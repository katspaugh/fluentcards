import React from 'react';
import styles from './Footer.css';

export default class Footer extends React.PureComponent {
  render() {
    return (
      <div className={ styles.container }>
        <footer>
          <a href="https://app.chatterbug.com/r/DerIvan-66">Get a 25% discount for private German, French or Spanish lessons from Chatterbug!</a>
        </footer>
      </div>
    );
  }
}
