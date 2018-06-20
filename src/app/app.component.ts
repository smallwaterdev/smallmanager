import { Component, OnInit } from '@angular/core';
import {WindowScrollService} from './window-scroll.service';
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

}
