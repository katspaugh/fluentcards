import {Component, enableProdMode} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {VocabService} from './services/vocab';
import {DictionaryService} from './services/dictionary';
import {TranslationService} from './services/translation';
import {ImageSearchService} from './services/image-search';

@Component({
    selector: 'app',
    pipes: [],
    providers: [ VocabService, DictionaryService, TranslationService, ImageSearchService ],
    directives: [ ROUTER_DIRECTIVES ],
    templateUrl: './app.html',
})
export class App {
    constructor() {}
}

// Enable production mode
if (!/localhost/.test(window.location.href)) {
    enableProdMode()
}
