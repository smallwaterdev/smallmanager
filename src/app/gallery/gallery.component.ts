import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'preview-picture-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  @Input() pictureUrls: string[];
  constructor() { }

  ngOnInit() {
  }

}
