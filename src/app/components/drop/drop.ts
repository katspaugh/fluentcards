import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'drop',
  pipes: [],
  providers: [],
  directives: [],
  styleUrls: [ './drop.css' ],
  templateUrl: './drop.html'
})
export class Drop {
    @Output() uploadData: EventEmitter<{}> = new EventEmitter();

    private db;
    isDragover = false;

    constructor() {}

    private stopEvent(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    onDragover(e) {
        this.stopEvent(e);
        this.isDragover = true;
    }

    onDragleave(e) {
        this.stopEvent(e);
        this.isDragover = false;
    }

    onDrop(e) {
        this.stopEvent(e);
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
                console.log(err);

                this.uploadData.next({
                    ok: false
                });
            };

            r.readAsArrayBuffer(file);
        });
    }
}
