import {Component, ViewEncapsulation} from '@angular/core';
import {Router, Event, NavigationEnd} from '@angular/router';

import {VocabService} from './services/vocab';

const FILE_ERROR = 'Error reading the file';
const DATA_ERROR = 'No vocabulary found in the file';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  errorMessage: string;

  constructor(
    private router: Router,
    private vocabService: VocabService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        window.ga('set', 'page', event.urlAfterRedirects);
        window.ga('send', 'pageview');
      }
    });

    window.addEventListener('error', (error: ErrorEvent) => {
      window.ga('send', 'event', {
        eventCategory: 'Script',
        eventAction: 'error',
        eventLabel: error.message,
        nonInteraction: true
      });
    });
  }

  onUpload(event) {
    this.errorMessage = '';

    if (!event.ok) {
      return this.errorMessage = FILE_ERROR;
    }

    let books = this.vocabService.loadBooks(event.data);

    if (!books) {
      return this.errorMessage = DATA_ERROR;
    }

    if (!books.isDemo) {
      this.router.navigate([ '/books', Math.random() ]);
    }
  }
}
