import { provideRouter, RouterConfig } from '@angular/router';

import {Home} from './components/home/home';
import {Book} from './components/book/book';

const routes: RouterConfig = [
    { path: '', component: Home },
    { path: 'book/:id', component: Book }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
