import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
    selector: 'export-view',
    directives: [ ROUTER_DIRECTIVES ],
    styleUrls: [ './export-view.css' ],
    templateUrl: './export-view.html'
})
export class ExportView {

    constructor() {
    }

}
