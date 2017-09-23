import React, { PureComponent } from 'react';
import classnames from 'classnames';
import styles from './Editable.css';

/**
 * Editable component
 */
export default class Editable extends PureComponent {
  constructor() {
    super();

    this._onBlur = () => this.onBlur();
    this._onKeyDown = e => this.onKeyDown(e);

    this.html = '';
  }

  resetInput() {
    this.input.innerHTML = this.html;
  }

  onBlur() {
    let newText = this.input.textContent.trim();

    if (!newText) {
      this.resetInput();
    } else if (newText !== this.props.text.trim()) {
      this.props.onChange(newText);
    }
  }

  onKeyDown(e) {
    if (e.key == 'Enter') {
      e.preventDefault();
      this.input.blur();
    } else if (e.key == 'Escape') {
      this.resetInput();
      this.input.blur();
    }
  }

  componentDidMount() {
    this.html = this.input.innerHTML;
  }

  componentDidUpdate() {
    this.html = this.input.innerHTML;
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    const classes = classnames(styles.editable, {
      [styles.empty]: !this.props.text
    });

    return (
      <span
        ref={ el => this.input = el }
        contentEditable
        className={ classes }
        onBlur={ this._onBlur }
        onKeyDown={ this._onKeyDown }
      >
        { this.props.children || this.props.text }
      </span>
    );
  }
}
