import {Directive, ElementRef, Renderer, HostListener} from '@angular/core';

@Directive({
  selector: '[sticky]'
})
export class Sticky {

  private offset: number;

  constructor(
    private el: ElementRef,
    private renderer: Renderer
  ) {}

  ngOnInit() {
    this.offset = this.getBoxTop();
  }

  private css(prop, val) {
    let el = this.el.nativeElement;
    this.renderer.setElementStyle(el, prop, val);
  }

  private toggleFixed(toggle) {
    this.css('position', toggle ? 'fixed' : '');
  }

  private getScroll() {
    return document.documentElement.scrollTop || document.body.scrollTop;
  }

  private getBoxTop() {
    let el = this.el.nativeElement;
    let bbox = el.getBoundingClientRect();
    return bbox.top;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.toggleFixed(this.getScroll() - this.offset > this.getBoxTop());
  }

}
