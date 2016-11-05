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
    return this.sanitizer.bypassSecurityTrustStyle(
      `linear-gradient(to bottom,
hsl(${ Math.random() * 360 }, 80%, 80%) 0%,
hsl(${ Math.random() * 360 }, 80%, 80%) 100%)`
    );
  }

  constructor(private sanitizer: DomSanitizer, private vocabService: VocabService) {
    this.books = this.vocabService.getBooks();

    // Add gradients for missing covers
    this.books.forEach((book) => {
      if (!book.cover) {
        book.gradient = this.randomGradient();
      }
    });
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
