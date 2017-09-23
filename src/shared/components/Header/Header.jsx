import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.css';

export default class Header extends React.PureComponent {
  componentDidMount() {
    if (!window.ga) return;

    const location = window.location;
    window.ga('set', 'page', location.pathname + location.search);
    window.ga('send', 'pageview');
  }

  render() {
    return (
      <div className={ styles.container }>
        <header>
          <h1>
            { this.props.children }
            { ' ' }
            { this.props.title }
          </h1>
        </header>
      </div>
    );
  }
}
