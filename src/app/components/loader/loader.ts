import {Component, Input} from '@angular/core';

@Component({
    selector: 'loader',
    pipes: [],
    providers: [],
    directives: [],
    styleUrls: [ './loader.css' ],
    template: '<div class="spinner" [ngClass]="{ spinner_active: isLoading }"></div>'
})
export class Loader {

    @Input() isLoading: boolean = false;

}
