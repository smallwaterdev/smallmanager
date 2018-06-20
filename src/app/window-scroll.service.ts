import { Injectable, OnInit } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class WindowScrollService{

  
  constructor(private router: Router){

  }

  start(){
    console.log('[WindowScrollService] On Init')
    this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      console.log(evt.url);
      window.scrollTo(0,0);
    });
  }
}
