import {Component, Input, Output, EventEmitter, ElementRef, HostListener} from '@angular/core';

import {ImageSearchService} from '../../services/image-search';
import {Loader} from '../loader/loader';

@Component({
  selector: 'vocab-images',
  pipes: [],
  providers: [],
  directives: [ Loader ],
  styleUrls: [ './vocab-images.css' ],
  templateUrl: './vocab-images.html'
})
export class VocabImages {
    @Input() word: string;
    @Input() language: string;
    @Input() single: boolean;
    @Output() onResult: EventEmitter<{}> = new EventEmitter();

    images: any[];
    errorMessage: string;
    isLoading: boolean;
    private retries = 3;

    constructor(
        private imageSearchService: ImageSearchService,
        private element: ElementRef
    ) {}

    private close() {
        this.onResult.next({
            image: null
        });
    }

    @HostListener('document:keyup', [ '$event.code' ])
    onKeyup(code) {
        if (code == 'Escape') {
            this.close();
        }
    }

    @HostListener('document:click', [ '$event.target' ])
    onClick(target) {
        if (!this.isLoading && !this.element.nativeElement.contains(target)) {
            this.close();
        }
    }

    selectImage(item) {
        this.onResult.next({ image: item });
    }

    private loadSingleImage() {
        this.isLoading = true;

        this.imageSearchService.getSingleImage(this.word, this.language)
            .subscribe(
                (data) => {
                    this.selectImage(data);
                    this.isLoading = false;
                },
                () => {
                    if (this.retries > 0) {
                        this.retries -= 1;
                        return this.loadSingleImage();
                    }

                    this.onResult.next({ image: null });
                    this.isLoading = false;
                }
            );
    }

    private loadImages() {
        this.isLoading = true;

        this.imageSearchService.getImages(this.word, this.language)
            .subscribe(
                (data) => {
                    this.images = data;
                    this.isLoading = false;
                },
                (errMessage) => {
                    if (this.retries > 0) {
                        this.retries -= 1;
                        return this.loadImages();
                    }

                    this.errorMessage = errMessage;
                    this.isLoading = false;
                }
            );
    }

    ngOnInit() {
        this.single ? this.loadSingleImage() : this.loadImages();
    }

}
