import {Routes} from '@angular/router';

import {StartView} from './components/start-view/start-view';
import {ExportView} from './components/export-view/export-view';
import {UploadView} from './components/upload-view/upload-view';
import {BooksView} from './components/books-view/books-view';
import {Book} from './components/book/book';

export const rootRouterConfig: Routes = [
    { path: '', component: StartView },
    { path: 'demo', redirectTo: 'books' },
    { path: 'export', component: ExportView },
    { path: 'upload', component: UploadView },
    { path: 'books',
      children: [
          { path: '', component: BooksView },
          { path: ':id', component: Book }
      ]
    }
];
