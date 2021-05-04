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

  private readonly K_MEANS_ROUNDS = 100;

  rgbToHSL(r: number, g: number, b: number): Color {
    r /= 255;
    g /= 255;
    b /= 255;

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
    return { h: 360-h, s, l };
  }

  getSquareDistance(color1: Color, color2: Color): number{
    const dh = color1.h - color2.h;
    const ds = color1.s - color2.s;
    const dl = color1.l - color2.l;
    return dh*dh + ds*ds + dl*dl;
  }

  generatePalette(canvas: HTMLCanvasElement, numberOfColors: number): Promise<Color[] | null> {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }

    return new Promise((resolve, reject) => {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const pixels: Color[] = [];
      for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        // const a = imgData[i+3];
  
        // Find greatest and smallest channel values
  
        pixels.push(this.rgbToHSL(r, b, g));
      }
  
      const means: Color[] = [];
      for (let i=0; i<numberOfColors; i++) {
        means.push({
          h: Math.random()*360,
          s: Math.random()*100,
          l: Math.random()*100
        });
        // means.push({
        //   h: 360*i/numberOfColors,
        //   s: 100,
        //   l: 100
        // });
        // means.push(pixels[Math.floor(Math.random()*pixels.length)])
      }
  
      // for (let _=0; _<this.K_MEANS_ROUNDS; _++) {
      const doRound = (roundNumber: number) => {
        if (roundNumber >= this.K_MEANS_ROUNDS) {
          resolve(means.filter((x) => x.h && x.s && x.l));
          return;
        }
        console.count("Round");
        const clusters: Color[][] =  [];
        for (let i=0; i<numberOfColors; i++) {
          clusters.push([]);
        }
  
        for(const pixel of pixels){
          let closestMean = -1;
          let closestSqrDistance = Infinity;
          means.forEach((mean, i) => {
            const distance = this.getSquareDistance(pixel, mean);
            if (distance< closestSqrDistance){
              closestSqrDistance = distance;
              closestMean = i;
            }
          });
          clusters[closestMean].push(pixel);
        }
  
        clusters.forEach((cluster, i) => {
          let hTotal = 0;
          let sTotal = 0;
          let lTotal = 0;
          for(const pixel of cluster){
            hTotal += pixel.h;
            sTotal += pixel.s;
            lTotal += pixel.l;
          }
          means[i].h = (hTotal/cluster.length);
          means[i].s = (sTotal/cluster.length);
          means[i].l = (lTotal/cluster.length);
        });
  
        setTimeout(() => {doRound(roundNumber+1)}, 0);
      }
  
      doRound(0);
    });
  }
}
