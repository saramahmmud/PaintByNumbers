import { Injectable } from '@angular/core';

export interface Color {
  h: number; // 0 to 360
  s: number; // 0 to 100
  l: number; // 0 to 100
}

@Injectable({
  providedIn: 'root'
})
export class PalGenService {

  constructor() { }

  generatePalette(canvas: HTMLCanvasElement): Color | null {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const pixels: Color[] = [];
    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i] / 255;
      const g = imgData[i + 1] / 255;
      const b = imgData[i + 2] / 255;
      // const a = imgData[i+3];

      // Find greatest and smallest channel values
      let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

      // Calculate hue
      // No difference
      if (delta == 0)
        h = 0;
      // Red is max
      else if (cmax == r)
        h = ((g - b) / delta) % 6;
      // Green is max
      else if (cmax == g)
        h = (b - r) / delta + 2;
      // Blue is max
      else
        h = (r - g) / delta + 4;

      h = Math.round(h * 60);

      // Make negative hues positive behind 360°
      if (h < 0)
        h += 360;

      // Calculate lightness
      l = (cmax + cmin) / 2;

      // Calculate saturation
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

      // Multiply l and s by 100
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);

      pixels.push({
        h, s, l
      });
    }

    console.log(pixels);

    return null;
  }

}
