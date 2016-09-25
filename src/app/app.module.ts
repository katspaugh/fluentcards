import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router';
import {rootRouterConfig} from './app.routes';
import {AppComponent} from './app';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {VocabService} from './services/vocab';
import {SpeechService} from './services/speech';
import {DictionaryService} from './services/dictionary';
import {DefinitionsService} from './services/definitions';
import {ImageSearchService} from './services/image-search';
import {MassTranslationService} from './services/mass-translation';
import {ContentfulService} from './services/contentful';

import {StartView} from './components/start-view/start-view';
import {IntroView} from './components/intro-view/intro-view';
import {ExportView} from './components/export-view/export-view';
import {UploadView} from './components/upload-view/upload-view';
import {BooksView} from './components/books-view/books-view';
import {Book} from './components/book/book';
import {StoriesView} from './components/stories-view/stories-view';
import {StoryView} from './components/story-view/story-view';

import {BookList} from './components/book-list/book-list';
import {Drop} from './components/drop/drop';
import {Footer} from './components/footer/footer';
import {Header} from './components/header/header';
import {Loader} from './components/loader/loader';
import {Sticky} from './components/sticky/sticky';
import {VocabImages} from './components/vocab-images/vocab-images';

@NgModule({
    declarations: [
        AppComponent, StartView, IntroView, ExportView, UploadView, BooksView, Book,
        BookList, Drop, Footer, Header, Loader, VocabImages,
        StoriesView, StoryView, Sticky
    ],
    imports     : [ BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig) ],
    providers   : [
        VocabService, DictionaryService, DefinitionsService, ImageSearchService,
        SpeechService, MassTranslationService, ContentfulService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: 'Window',  useValue: window }
    ],
    bootstrap   : [ AppComponent ]
})
export class AppModule {

}
