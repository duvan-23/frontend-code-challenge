import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appHighlightInvalid]',
})
export class HighlightInvalid {
  private element = inject(ElementRef);
  private renderer = inject(Renderer2);
  private control = inject(NgControl);

  ngOnInit(): void {
    this.control.statusChanges?.subscribe(() => {
      const isInvalid =
        this.control.invalid && (this.control.touched || this.control.dirty);

      if (isInvalid) {
        this.renderer.setStyle(
          this.element.nativeElement,
          'border',
          '2px solid #f87171'
        );
        this.renderer.setStyle(
          this.element.nativeElement,
          'borderRadius',
          '0.375rem'
        );
        this.renderer.setStyle(this.element.nativeElement, 'boxShadow', 'none');
      } else {
        this.renderer.removeStyle(this.element.nativeElement, 'border');
        this.renderer.removeStyle(this.element.nativeElement, 'borderRadius');
        this.renderer.removeStyle(this.element.nativeElement, 'boxShadow');
      }
    });
  }
}
