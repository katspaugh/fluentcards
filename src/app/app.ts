import {Component, enableProdMode} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {VocabService} from './services/vocab';
import {TranslationService} from './services/translation';

@Component({
    selector: 'app',
    pipes: [],
    providers: [ VocabService, TranslationService ],
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
