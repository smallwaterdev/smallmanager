import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {UrlService} from '../url.service';
import {ContentService} from '../content.service'

import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'smallmanager-last-next-btn',
  templateUrl: './last-next-btn.component.html',
  styleUrls: ['./last-next-btn.component.css']
})
export class LastNextBtnComponent implements OnInit {

  pagearray: number[] = [];
  itemNumber: number;
  currentPage: number = 1;
  routerEvent: Subscription;
  constructor(private router: Router, private url: UrlService, private contentService:ContentService) { }

  next(){
    if(this.currentPage + 1 <= this.itemNumber){
      this.goto(this.currentPage + 1)
    }
  }
  back(){
    if(this.currentPage > 1){
      this.goto(this.currentPage - 1);
    }
  }
  fastnext(){
    if(this.currentPage + 10 <= this.itemNumber){
      this.goto(this.currentPage + 10);
    }else{
      this.goto(this.itemNumber);
    }
  }
  fastback(){
    if(this.currentPage > 10){
      this.goto(this.currentPage - 10);
    }else{
      this.goto(1);
    }
  }
  goto(page:number){
    // /list/field/value
    // /list/field/value/1
    // /list/field/value/sort
    // /list/field/value/sort/2
    if(page === this.currentPage){
      return;
    }
    let data = this.url.convertUrl2Request(this.router.url)
    if(data['sort']){
      this.router.navigate(['/list',data['field'], data['value'], data['sort'], page]);
    }else{
      this.router.navigate(['/list',data['field'], data['value'], page]);
    }
    this.currentPage = page;
    this.updatePageArray(this.itemNumber, this.currentPage);
    //
  }
  updatePageArray(total: number, current: number){
    if(current > total){
      return;
    }
    // total 7 page button
    let start = current - 3;
    let pagearray = [];
    while(pagearray.length < 7){
      if(start > 0 && start <= total){
        pagearray.push(start);
      }else if(start > total){
        break;
      }
      start++;
    }
    while(pagearray.length < 7 && pagearray.length > 0){
      
      if(pagearray[0] > 1){
        pagearray.splice(0, 0, pagearray[0] - 1);
      }else{
        break;
      }
      
    }
    this.currentPage = current;
    this.pagearray = pagearray;
  }
  ngOnInit() {
    // 1. open from a link  e.g. click http://localhost:4200/list/genre/big-tits
    // or 2. open from http://localhost:4200
    
    //if(this.router.url.indexOf('/list/') !== -1){
      let data = this.url.convertUrl2Request(this.router.url);
      if(data['field'] && data['value']){
        this.contentService.queryFieldValueNumber(data['field'], data['value']).subscribe(result=>{
          if(result && result['result']){
            this.itemNumber = Math.ceil(result['result'] / 20);
            if(data['page']){
              this.updatePageArray(this.itemNumber, data['page']);
            }else{
              this.updatePageArray(this.itemNumber, 1);
            }
          }else{
            this.itemNumber = 1;
            this.updatePageArray(this.itemNumber, 1);
          }
        });
      }
    //}
    this.routerEvent = this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      console.log('[Last/NextBtn] Nav from search frame');
      if(evt.url.indexOf('/list/') !== -1){
        let data = this.url.convertUrl2Request(evt.url);
        this.contentService.queryFieldValueNumber(data['field'], data['value']).subscribe(result=>{
            if(result && result['result']){
              this.itemNumber = Math.ceil(result['result'] / 20);
              if(data['page']){
                this.updatePageArray(this.itemNumber, data['page']);
              }else{
                this.updatePageArray(this.itemNumber, 1);
              }
            }else{
              this.itemNumber = 1;
              this.updatePageArray(this.itemNumber, 1);
            }
        });
      }
    });
  }
  


}
