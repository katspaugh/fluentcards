import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';

import {AppModule} from './app/app.module';

if (/fluentcards\.com/.test(window.location.host)) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));

// A workaround for a bug in Safari
if (/Safari/.test(window.navigator.userAgent) && !/Chrome/.test(window.navigator.userAgent)) {
    window.addEventListener('popstate', () => {
        window.location.replace(window.location.href);
    });
}
