import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor() { }

  uploadedImage?: string;

  ngOnInit(): void {
  }

  imageUploaded(event: Event) {
    const file = (event.target as any).files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.uploadedImage = (reader.result as string);
    }

    reader.readAsDataURL(file);
  }

}
