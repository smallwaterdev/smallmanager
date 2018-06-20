import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'video-frame',
  templateUrl: './video-frame.component.html',
  styleUrls: ['./video-frame.component.css']
})
export class VideoFrameComponent implements OnInit {

  @Input() videoUrl: string;
  @Input() isDisplay: boolean;
  constructor() { }
  ngOnInit() {
  }

}
