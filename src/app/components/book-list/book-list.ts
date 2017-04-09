import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VocabService } from '../../services/vocab';

@Component({
  selector: 'book-list',
  styleUrls: [ './book-list.css' ],
  templateUrl: './book-list.html'
})
export class BookList {
  bookGroups = [
    {
      title: 'Extension deck',
      books: []
    },
    {
      title: 'Kindle deck',
      books: []
    },
    {
      title: 'Community deck',
      books: []
    }
  ];

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

  constructor(
    private sanitizer: DomSanitizer,
    private vocabService: VocabService
  ) {
    this.vocabService.getStoredBooks()
      .subscribe(books => {
        this.bookGroups[0].books = books.filter(b => this.isExtensionData(b));
        this.bookGroups[1].books = books.filter(b => !this.isExtensionData(b));
      });

    this.vocabService.loadApiBooks().subscribe(books => {
      this.bookGroups[2].books = books;
    });
  }

  private isExtensionData(book) {
    return /extension-/.test(book.id);
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
    }
  }

}
