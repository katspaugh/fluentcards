import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VocabService } from '../../services/vocab';
import { randomGradient } from '../../services/gradient';


function isExtensionData(book) {
  return /extension-/.test(book.id);
}

function isPlainTextData(book) {
  return /plaintext-/.test(book.id);
}

function isKindleData(book) {
  return !isExtensionData(book) && !isPlainTextData(book);
}


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
      title: 'Imported deck',
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

  constructor(
    private sanitizer: DomSanitizer,
    private vocabService: VocabService
  ) {
    this.vocabService.getStoredBooks()
      .subscribe(books => {
        this.bookGroups[0].books = books.filter(isExtensionData);
        this.bookGroups[1].books = books.filter(isPlainTextData);
        this.bookGroups[2].books = books.filter(isKindleData);
      });

    this.vocabService.loadApiBooks().subscribe(books => {
      this.bookGroups[this.bookGroups.length - 1].books = books;
    });
  }

  getGradient(book) {
    book.gradient = book.gradient || randomGradient();
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
