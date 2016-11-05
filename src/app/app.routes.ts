import {Routes} from '@angular/router';

import {StartView} from './components/start-view/start-view';
import {IntroView} from './components/intro-view/intro-view';
import {ExportView} from './components/export-view/export-view';
import {UploadView} from './components/upload-view/upload-view';
import {BooksView} from './components/books-view/books-view';
import {Book} from './components/book/book';
import {StoriesView} from './components/stories-view/stories-view';
import {StoryView} from './components/story-view/story-view';

export const rootRouterConfig: Routes = [
  {
    path: '', component: StartView,
    children: [
      { path: '', component: IntroView },
      { path: 'export', component: ExportView },
      { path: 'upload', component: UploadView }
    ]
  },
  { path: 'demo', redirectTo: 'books' },
  { path: 'books',
    children: [
      { path: '', component: BooksView },
      { path: ':id', component: Book }
    ]
  },
  { path: 'stories',
    children: [
      { path: '', component: StoriesView },
      { path: ':id', component: StoryView }
    ]
  }

];
