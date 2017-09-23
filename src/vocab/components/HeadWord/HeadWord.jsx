import React, { PureComponent } from 'react';
import { getArticle } from '../../services/formating';
import Editable from '../Editable/Editable.jsx';
import styles from './HeadWord.css';


/**
 * HeadWord component
 */
export default class HeadWord extends PureComponent {
  /**
   * @return {JSX.Element}
   */
  render() {
    const data = this.props.def[0];

    const article = getArticle(data, this.props.lang);

    const extra = (data.fl || data.num || data.gen) ? (
      <span className={ styles.extra }>
        <span className={ styles.fl }>{ data.fl || '' }</span>
        { data.fl && (data.num || data.gen) ? ', ' : '' }
        <span className={ styles.gen }>{ data.num || data.gen || '' }</span>
      </span>
    ) : '';

    const transcription = data.ts ? (
      <span className={ styles.extra }>{ data.ts }</span>
    ) : '';

    const word = (
      <Editable text={ data.text } onChange={ this.props.onChange } />
    );

    return (
      <div className={ styles.container }>
        <div className={ styles.wordBlock }>
          { article ? (
            <span className={ styles.word }>
              { article }&nbsp;{ word }
            </span>
          ) : (
            <span className={ styles.word }>
              { word }
            </span>
          ) }

          { ' ' }

          { extra || transcription }
        </div>

        { extra ? (
          <div>{ transcription }</div>
        ) : '' }
      </div>
    );
  }
}
