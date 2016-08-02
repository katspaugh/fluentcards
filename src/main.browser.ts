import {enableProdMode} from '@angular/core';
import {LocationStrategy, PathLocationStrategy, HashLocationStrategy} from '@angular/common';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
// import {enableProdMode} from '@angular/core';

import {APP_ROUTER_PROVIDERS} from './app/app.routes';
import {App} from './app/app';

if (/fluentcards\.com/.test(window.location.host)) {
    enableProdMode()
}

bootstrap(App, [
  HTTP_PROVIDERS,
  APP_ROUTER_PROVIDERS,
  { provide: LocationStrategy, useClass: PathLocationStrategy }
])
.catch(err => console.error(err));
