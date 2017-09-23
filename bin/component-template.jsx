import React, { PureComponent } from 'react';
import styles from './ComponentName.css';


/**
 * ComponentName component
 */
export default class ComponentName extends PureComponent {
  constructor() {
    super();

    this.state = {
    };
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <div className={ styles.container }>
      </div>
    );
  }
}
