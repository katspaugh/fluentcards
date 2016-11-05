import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'drop',
  styleUrls: [ './drop.css' ],
  templateUrl: './drop.html'
})
export class Drop {
  @Output() uploadData: EventEmitter<{}> = new EventEmitter();

  private timer;
  isDragover = false;

  constructor() {}

  onDragOver(e) {
    e.preventDefault();
    this.isDragover = true;
    if (this.timer) clearTimeout(this.timer);
  }

  onDragLeave(e) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.isDragover = false, 1000);
  }

  onDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.isDragover = false;

    Array.prototype.forEach.call(e.dataTransfer.files, (file) => {
      var r = new FileReader();
      r.onload = () => {
        let uints = new Uint8Array(r.result);

        this.uploadData.next({
          ok: true,
          data: uints
        });
      };
      r.onerror = (err) => {
        this.uploadData.next({
          ok: false
        });
      };

      r.readAsArrayBuffer(file);
    });
  }
}
