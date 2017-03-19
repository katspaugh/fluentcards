import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router';
import {rootRouterConfig} from './app.routes';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';

import {ApkgService} from './services/apkg';
import {CsvService} from './services/csv';
import {ExtensionService} from './services/browser-extension';
import {KindleService} from './services/kindle';
import {VocabService} from './services/vocab';
import {SpeechService} from './services/speech';
import {DictionaryService} from './services/dictionary';
import {DefinitionsService} from './services/definitions';
import {ImageSearchService} from './services/image-search';
import {MassTranslationService} from './services/mass-translation';

import {StartView} from './components/start-view/start-view';
import {UploadView} from './components/upload-view/upload-view';
import {BooksView} from './components/books-view/books-view';
import {Book} from './components/book/book';

import {BookList} from './components/book-list/book-list';
import {Drop} from './components/drop/drop';
import {Footer} from './components/footer/footer';
import {Header} from './components/header/header';
import {Loader} from './components/loader/loader';
import {VocabImages} from './components/vocab-images/vocab-images';
import {Editable} from './components/editable/editable';

@NgModule({
  declarations: [
    AppComponent, StartView, UploadView, BooksView, Book,
    BookList, Drop, Footer, Header, Loader, VocabImages, Editable
  ],
  imports     : [ BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig) ],
  providers   : [
    ApkgService, CsvService,
    ExtensionService, KindleService, VocabService,
    DictionaryService, DefinitionsService, ImageSearchService,
    SpeechService, MassTranslationService,
    { provide: 'Window',  useValue: window }
  ],
  bootstrap   : [ AppComponent ]
})
export class AppModule {

}
