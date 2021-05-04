import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PalGenService } from '../pal-gen.service';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.scss']
})
export class ImageDisplayComponent {

  constructor(private palette: PalGenService) { }

  // @Input() imageSrc?: string;

  @ViewChild("canvas") canvas!: ElementRef;

  _imageSrc?: string;

  get imageSrc() {
    return this._imageSrc;
  }

  @Input() set imageSrc(x: string | undefined) {
    this._imageSrc = x;
    const ctx = this.canvas?.nativeElement?.getContext("2d");
    if (!ctx || !x) {
      return;
    }
    const image = new Image();
    image.onload = () => {
      if (!this.canvas) {
        return;
      }
      this.canvas.nativeElement.width = image.width;
      this.canvas.nativeElement.height = image.height;
      ctx.drawImage(image, 0, 0);

      this.palette.generatePalette(this.canvas.nativeElement);
    };

    image.src = x;

  }

}
