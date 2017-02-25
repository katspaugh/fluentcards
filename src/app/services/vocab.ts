import { Injectable, Inject } from '@angular/core';
import { KindleService } from './kindle';
import { ExtensionService } from './browser-extension';

@Injectable()
export class VocabService {

  private books: any;
  private storage: any;

  constructor(
    @Inject('Window') private window: Window,
    private extensionService: ExtensionService,
    private kindleService: KindleService
  ) {
    this.storage = this.window.localStorage;

    this.books = JSON.parse(this.storage.getItem('books'));

    // Load demo books
    if (!this.books) {
      this.books = require('../../data/books').default;
      this.books.isDemo = true;
    }

    // Load browser extension's vocab
    this.extensionService.getVocab()
      .then((items: any[]) => {
        if (!items.length) return;

        if (this.books.isDemo) {
          this.books.length = 0;
          delete this.books.isDemo;
        }

        items.forEach(item => {
          const existingItem = this.books.filter(book => book.asin === item.asin)[0];

          if (existingItem) {
            Object.assign(existingItem, item);
          } else {
            this.books.unshift(item);
          }
        });
      });
  }

  private storeBooks() {
    this.storage.setItem('books', JSON.stringify(this.books));
  }

  private findBook(asin: string) {
    if (!this.books) return null;
    return this.books.filter((book) => book.asin == asin)[0];
  }

  private preloadVocabs() {
    // Sequentially load vocabs for each book
    let preload = (index) => {
      if (index == this.books.length) {
        return this.storeBooks();
      }
      let book = this.books[index];
      book.vocabs = this.kindleService.queryVocabs(book.id);
      setTimeout(() => preload(index + 1), 0);
    };

    preload(0);
  }

  loadBooks(uints: any) {
    this.kindleService.initDb(uints)
    let books = this.kindleService.queryBooks();

    if (!books) return null;

    this.books = books;
    this.preloadVocabs();

    return this.books;
  }

  getBooks() {
    return this.books;
  }

  getBook(asin: string) {
    let book = this.findBook(asin);

    if (book && !book.vocabs) {
      book.vocabs = this.kindleService.queryVocabs(book.id);
    }

    return book;
  }

  updateBook(book) {
    book.count = book.vocabs.length;
    this.storeBooks();
  }

  removeBook(book) {
    let index = this.books.indexOf(book);
    this.books.splice(index, 1);
    this.storeBooks();
  }

};
