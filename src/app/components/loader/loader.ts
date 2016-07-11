import {Component, Input} from '@angular/core';

@Component({
    selector: 'loader',
    pipes: [],
    providers: [],
    directives: [],
    styleUrls: [ './loader.css' ],
    template: '<div class="spinner" [ngClass]="{ spinner_active: isLoading, spinner_dark: dark }"></div>'
})
export class Loader {

    @Input() isLoading: boolean = false;
    @Input() dark: boolean = false;

}
