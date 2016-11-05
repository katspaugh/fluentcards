import {Component, Input} from '@angular/core';

@Component({
  selector: 'loader',
  styleUrls: [ './loader.css' ],
  template: '<div class="spinner" [ngClass]="{ spinner_active: isLoading, spinner_dark: dark }"></div>'
})
export class Loader {

  @Input() isLoading: boolean;
  @Input() dark: boolean;

}
