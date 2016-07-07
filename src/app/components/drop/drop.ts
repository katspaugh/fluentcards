import {Component, Input, Output, EventEmitter} from '@angular/core';

import {VocabService} from '../../services/vocab';

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
    error = '';

    constructor(private vocabService: VocabService) {}

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
        this.error = '';

        Array.prototype.forEach.call(e.dataTransfer.files, (file) => {
            if (file.name != 'vocab.db') {
                this.error = 'Wrong vocab.db file';
                return;
            }

            var r = new FileReader();
            r.onload = () => {
                let uints = new Uint8Array(r.result);
                this.vocabService.init(uints);

                this.uploadData.next({
                    ok: true
                });
            };
            r.readAsArrayBuffer(file);
        });
    }
}
