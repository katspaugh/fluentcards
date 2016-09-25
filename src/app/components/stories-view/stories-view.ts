import {Component} from '@angular/core';

import {ContentfulService} from '../../services/contentful';

@Component({
    selector: 'stories-view',
    styleUrls: [ './stories-view.css' ],
    templateUrl: './stories-view.html'
})
export class StoriesView {
    texts: any[];

    constructor(
        private contentfulService: ContentfulService
    ) {
        this.contentfulService.client.getEntries({
            content_type: 'text',
            limit: 6
        })
            .then((data) => this.texts = data.items);
    }

}
