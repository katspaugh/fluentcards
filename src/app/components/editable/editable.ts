import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'editable',
  styleUrls: [ './editable.css' ],
  templateUrl: './editable.html'
})
export class Editable {
  @Input() text: string;
  @Input() noEmpty: boolean;
  @Output() onChange: EventEmitter<{}> = new EventEmitter();

  isBlock = false;

  ngOnInit() {
    this.isBlock = this.text.length > 50;
  }

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
    }
  }
}
