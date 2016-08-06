import {provideRouter, RouterConfig} from '@angular/router';

import {Home} from './components/home/home';
import {Book} from './components/book/book';
import {KindleLp} from './components/kindle-lp/kindle-lp';

const routes: RouterConfig = [
    { path: '', component: KindleLp },
    { path: 'books', component: Home },
    { path: 'book/:id', component: Book }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
