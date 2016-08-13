import {provideRouter, RouterConfig, Routes} from '@angular/router';

import {Home} from './components/home/home';
import {Book} from './components/book/book';
import {KindleLp} from './components/kindle-lp/kindle-lp';

export const rootRouterConfig: Routes = [
    { path: '', redirectTo: 'kindle', terminal: true },
    { path: 'kindle', component: KindleLp },
    { path: 'books',
      children: [
          { path: '', component: Home },
          { path: ':id', component: Book }
      ]
    }
];
