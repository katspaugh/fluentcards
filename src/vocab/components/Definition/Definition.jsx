import React, { PureComponent } from 'react';
import Editable from '../Editable/Editable.jsx';

/**
 * Definition component
 */
export default class Definition extends PureComponent {
  /**
   * @return {JSX.Element}
   */
  render() {
    const maxDefs = 2;
    const { def } = this.props;

    const definitions = [];
    def.forEach(item => item.tr ? item.tr.forEach(tr => definitions.push(tr.text)) : '');

    return (
      <Editable
        text={ definitions.slice(0, maxDefs).join('; ') }
        onChange={ this.props.onChange }
      />
    );
  }
}
