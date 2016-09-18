import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router';
import {rootRouterConfig} from './app.routes';
import {AppComponent} from './app';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {VocabService} from './services/vocab';
import {DictionaryService} from './services/dictionary';
import {TranslationService} from './services/translation';
import {ImageSearchService} from './services/image-search';

import {StartView} from './components/start-view/start-view';
import {IntroView} from './components/intro-view/intro-view';
import {ExportView} from './components/export-view/export-view';
import {UploadView} from './components/upload-view/upload-view';
import {BooksView} from './components/books-view/books-view';
import {Book} from './components/book/book';

import {BookList} from './components/book-list/book-list';
import {Drop} from './components/drop/drop';
import {Footer} from './components/footer/footer';
import {Header} from './components/header/header';
import {Loader} from './components/loader/loader';
import {VocabImages} from './components/vocab-images/vocab-images';

@NgModule({
    declarations: [
        AppComponent, StartView, IntroView, ExportView, UploadView, BooksView, Book,
        BookList, Drop, Footer, Header, Loader, VocabImages
    ],
    imports     : [ BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig) ],
    providers   : [
        VocabService, DictionaryService, TranslationService, ImageSearchService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: 'Window',  useValue: window }
    ],
    bootstrap   : [ AppComponent ]
})
export class AppModule {

}
