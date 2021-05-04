import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Color, PalGenService } from '../pal-gen.service';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.scss']
})
export class ImageDisplayComponent {

  constructor(private palette: PalGenService) { }

  @ViewChild("canvas") canvas!: ElementRef;

  colors: Color[] = [];

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
    image.onload = async () => {
      if (!this.canvas) {
        return;
      }
      this.canvas.nativeElement.width = image.width;
      this.canvas.nativeElement.height = image.height;
      ctx.drawImage(image, 0, 0);

      this.colors = await this.palette.generatePalette(this.canvas.nativeElement, 6) ?? [];
    };

    image.src = x;

  }

}
