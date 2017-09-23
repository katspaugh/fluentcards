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

    const defintions = [];
    def.forEach(item => item.tr ? item.tr.forEach(tr => defintions.push(tr.text)) : '');

    return (
      <Editable
        text={ defintions.slice(0, maxDefs).join('; ') }
        onChange={ this.props.onChange }
      />
    );
  }
}
