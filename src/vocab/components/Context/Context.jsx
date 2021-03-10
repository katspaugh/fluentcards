import React, { PureComponent } from 'react';
import { escapeRegexp } from '../../../shared/services/Utils';
import Editable from '../Editable/Editable.jsx';


/**
 * Context component
 */
export default class Context extends PureComponent {
  /**
   * @return {?JSX.Element}
   */
  render() {
    const { context, selection } = this.props;

    if (!context) return null;

    let parts = context.split(new RegExp('\\b' + escapeRegexp(selection) + '\\b'));
    if (parts.length === 1) {
      parts = context.split(selection);
    }

    return (
      <Editable text={ context } onChange={ this.props.onChange }>
        { parts.length > 1 ? (
          <span>
            { parts[0] }<b>{ selection }</b>{ parts[1] }
          </span>
        ) : parts[0] }
      </Editable>
    );
  }
}
