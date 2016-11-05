import {Component} from '@angular/core';

@Component({
    selector: 'upload-view',
    styleUrls: [ './upload-view.css' ],
    templateUrl: './upload-view.html'
})
export class UploadView {

    constructor() {
    }

    ngOnInit() {
        document.body.classList.add('upload-page');
    }

    ngOnDestroy() {
        document.body.classList.remove('upload-page');
    }

}
