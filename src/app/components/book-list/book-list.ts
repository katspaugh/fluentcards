import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {VocabService} from '../../services/vocab';

@Component({
  selector: 'book-list',
  styleUrls: [ './book-list.css' ],
  templateUrl: './book-list.html'
})
export class BookList {
  books: any[];

  private randomGradient() {
    const hueA = ~~(Math.random() * 360);
    const hueB = ~~(Math.random() * 360);
    const angle = ~~(Math.random() * 360);
    const size = ~~(Math.random() * 100);

    return (
      `repeating-linear-gradient(
         ${ angle }deg,
         hsla(${ hueA }, 80%, 40%, 0.7),
         hsla(${ hueA }, 80%, 40%, 0.7) ${ size }px,
         hsla(${ hueB }, 80%, 80%, 0.7) ${ size }px,
         hsla(${ hueB }, 80%, 80%, 0.7) ${ size * 2 }px
       )`
    );
  }

  constructor(private sanitizer: DomSanitizer, private vocabService: VocabService) {
    this.books = this.vocabService.getBooks();
  }

  getGradient(book) {
    book.gradient = book.gradient || this.randomGradient();
    return this.sanitizer.bypassSecurityTrustStyle(book.gradient);
  }

  truncateWords(text, wordsCount) {
    const delim = ' ';
    let words = text.split(delim);
    let ellipsis = words.length > wordsCount ? '…' : '';
    return words.slice(0, wordsCount).join(delim) + ellipsis;
  }

  removeBook(book) {
    if (confirm("Don't show this book?")) {
      this.vocabService.removeBook(book);
      this.books = this.vocabService.getBooks();
    }
  }

}
