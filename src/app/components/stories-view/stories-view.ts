import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ContentfulService} from '../../services/contentful';

@Component({
    selector: 'stories-view',
    styleUrls: [ './stories-view.css' ],
    templateUrl: './stories-view.html'
})
export class StoriesView {
    items: Observable<any[]>

    constructor(
        private contentfulService: ContentfulService
    ) {
        this.items = this.contentfulService.getEntries({
            content_type: 'text',
            limit: 10
        }).map((data: any) => data.items);
    }

}
