import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/of';
import { Injectable, Inject } from '@angular/core';
import { KindleService } from './kindle';
import { ExtensionService } from './extension';
import { FluentcardsApiService } from './fluentcards-api';

@Injectable()
export class VocabService {

  private books = [];
  private booksStream = new ReplaySubject<any[]>();

  constructor(
    private extensionService: ExtensionService,
    private kindleService: KindleService,
    private fluentcardsApiService: FluentcardsApiService
  ) {
    this.books = this.restoreBooks() || this.books;
    this.booksStream.next(this.books);

    // Load browser extension's vocab
    this.extensionService.getVocab()
      .subscribe((items: any[]) => {
        if (!items.length) return;

        this.extendBooks(this.books, items);

        this.booksStream.next(this.books);

        this.saveBooks();
      });
  }

  private restoreBooks() {
    const json = localStorage.getItem('fluentcards-books');
    let data;
    try {
      data = JSON.parse(json);
    } catch (e) {}
    return data;
  }

  private saveBooks() {
    localStorage.setItem('fluentcards-books', JSON.stringify(this.books));
  }

  private extendVocabs(book, vocabs) {
    const newVocabs = book.vocabs.length ? vocabs.filter(vocab => {
      return !book.vocabs.some(v => v.baseForm === vocab.baseForm && v.context === vocab.context);
    }) : vocabs;

    book.vocabs = book.vocabs.concat(newVocabs);
    book.count = book.vocabs.filter(v => !v.isDeleted).length;
  }

  private extendBooks(books, newBooks) {
    newBooks.forEach(book => {
      let existingBook = books.find(b => b.id === book.id);

      if (!existingBook) {
        existingBook = book;
        books.push(book);
      }

      if (existingBook.isDeleted) return;

      this.extendVocabs(existingBook, book.vocabs);
      existingBook.lastLookup = book.lastLookup;
    });
  }

  private filterVocabs(book) {
    return Object.assign({}, book, {
      vocabs: book.vocabs.filter(v => !v.isDeleted)
    });
  }

  findBook(slug: string) {
    if (!this.books) return null;
    return this.books.find((book) => book.slug === slug);
  }

  loadKindleBooks(uints: any) {
    this.kindleService.initDb(uints)
    let books = this.kindleService.queryBooks();

    if (!books) return null;

    books.forEach(book => {
      book.vocabs = this.kindleService.queryVocabs(book.id);
    });

    this.extendBooks(this.books, books);

    setTimeout(() => {
      this.saveBooks();
    }, 100);

    this.booksStream.next(this.books);

    return this.books;
  }

  loadApiBooks() {
    return this.fluentcardsApiService.list()
      .map(data => {
        return data
          .map(item => item.vocab)
          .filter(item => item.cover && item.count > 20)
          .filter(item => !this.books.some(b => b.slug === item.slug));
      });
  }

  getStoredBooks() {
    return this.booksStream
      .map(books => books.filter(b => !b.isDeleted));
  }

  getBook(slug: string) {
    let book = this.findBook(slug);

    if (book && book.vocabs) {
      return Observable.of(this.filterVocabs(book));
    }

    return this.fluentcardsApiService.get(slug)
      .map(data => data.vocab);
  }

  createBook(book) {
    this.books.push(book);
    this.saveBooks();
  }

  updateBook(book) {
    const isStored = this.books.some(b => b.slug === book.slug);

    if (!isStored) {
      this.books.push(book);
    }

    book.count = book.vocabs.filter(v => !v.isDeleted).length;

    this.saveBooks();
  }

  removeVocab(book, index) {
    book.vocabs[index].isDeleted = true;
    this.updateBook(book);
    return this.filterVocabs(book);
  }

  removeBook(book) {
    book.isDeleted = true;
    this.updateBook(book);
    this.booksStream.next(this.books);
  }

  share(book) {
    return this.fluentcardsApiService.create(book.slug, book);
  }

};
