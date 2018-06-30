import { Component, OnInit } from '@angular/core';
import {WindowScrollService} from './services/window-scroll.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private windowScroller: WindowScrollService){}
  ngOnInit(){
    this.windowScroller.start();
  }
  goTop(){
    window.scrollTo(0,0);
  }
}
