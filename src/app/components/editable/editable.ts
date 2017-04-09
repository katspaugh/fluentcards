import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'editable',
  styleUrls: [ './editable.css' ],
  templateUrl: './editable.html'
})
export class Editable {
  @Input() text: string;
  @Input() isBlock: boolean;
  @Input() noEmpty: boolean;
  @Output() onChange: EventEmitter<{}> = new EventEmitter();

  onBlur($event) {
    let newText = $event.target.textContent.trim();

    if (this.noEmpty && !newText) {
      newText = this.text;
      $event.target.textContent = newText;
    }

    if (newText !== this.text) {
      this.onChange.next(newText);
    }
  }

  onKeyDown($event) {
    if ($event.key == 'Enter') {
      $event.preventDefault();
      $event.target.blur();
    } else if ($event.key == 'Escape') {
      $event.target.textContent = this.text;
      $event.target.blur();
    }
  }
}
