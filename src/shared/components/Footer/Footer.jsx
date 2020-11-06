import React from 'react';
import styles from './Footer.css';

export default class Footer extends React.PureComponent {
  render() {
    return (
      <div className={ styles.container }>
        <footer>
          <a href="https://www.lingoda.com/en/referral/hwnm43">Get 50$ to learn a foreign language at Lingoda!</a>
        </footer>
      </div>
    );
  }
}
