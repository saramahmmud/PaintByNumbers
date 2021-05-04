import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.scss']
})
export class ImageDisplayComponent implements OnInit {

  constructor() { }

  @Input() imageSrc?: string;

  ngOnInit(): void {
  }

}
