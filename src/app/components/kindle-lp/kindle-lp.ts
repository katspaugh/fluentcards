import {Component, ViewEncapsulation} from '@angular/core';

import {KindleFrame} from '../kindle-frame/kindle-frame';
import {MacFrame} from '../mac-frame/mac-frame';

@Component({
    selector: 'kindle-lp',
    pipes: [],
    providers: [],
    directives: [ KindleFrame, MacFrame ],
    styleUrls: [ './kindle-lp.css' ],
    templateUrl: './kindle-lp.html',
    encapsulation: ViewEncapsulation.None
})
export class KindleLp {
    private steps = [
        1, 2
    ];

    step: number = 1;

    nextStep() {
        let index = this.steps.indexOf(this.step);
        this.step = this.steps[(index + 1) % this.steps.length];
    }
}
