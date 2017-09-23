import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import classnames from 'classnames';
import Kindle from '../../services/kindle';
import KindleVocab from '../../services/kindle-vocab';
import styles from './KindleUpload.css';


/**
 * KindleUpload component
 */
export default class KindleUpload extends PureComponent {
  constructor() {
    super();

    this.kindle = null;
    this.timer = null;

    this.state = {
      isDraggingOver: false,
      redirecting: false
    };
  }

  onDragOver(e) {
    e.preventDefault();
    this.setState({ isDraggingOver: true });
    if (this.timer) clearTimeout(this.timer);
  }

  onDragLeave(e) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ isDraggingOver: false });
    }, 1000);
  }

  onDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    this.setState({ isDraggingOver: false });

    Array.prototype.forEach.call(e.dataTransfer.files, (file) => {
      var r = new FileReader();

      r.onload = () => this.onUpload(new Uint8Array(r.result));

      r.onerror = (err) => this.onError(err);

      r.readAsArrayBuffer(file);
    });
  }

  onUpload(data) {
    this.kindle = new Kindle();

    this.kindle.init().then(() => {
      this.kindle.loadDb(data);
      const books = this.kindle.queryBooks();
      KindleVocab.setBooks(books);

      books && books.forEach(book => {
        setTimeout(() => {
          book.vocabs = this.kindle.queryVocabs(book.id);
          KindleVocab.setBooks(books);
        }, 300);
      });

      this.setState({ redirecting: true });
    });
  }

  onError(err) {
    console.log(err);
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    if (this.state.redirecting) return (
      <Redirect to="/vocab" />
    );

    const classes = classnames(styles.container, {
      [styles.draggingOver]: this.state.isDraggingOver
    });

    return (
      <div
        className={ classes }
        onDragOver={ e => this.onDragOver(e) }
        onDragLeave={ e => this.onDragLeave(e) }
        onDrop={ e => this.onDrop(e) }
        >
        <div className={ styles.wrapper }>
          <div className={ styles.content }>
            <h1>Drag and drop from the Kindle</h1>

            <ol>
              <li>
                Connect your Kindle to the computer via a USB cable.
              </li>

              <li>
                Locate the <a className={ styles.hoverLink } target="_blank" href="/images/vocab-db.png">vocab.db</a>
                <img className={ styles.hoverImage } src="/images/vocab-db.png" /> file on the Kindle disk (use the search).
              </li>

              <li>
                Drag and drop the file onto this page.
              </li>
            </ol>
          </div>

          <p className={ styles.note }>
            Note: the file is processed and stored entirely locally in your browser.<br />
            We don't upload your Kindle data to any server.
          </p>
        </div>
      </div>
    );
  }
}
