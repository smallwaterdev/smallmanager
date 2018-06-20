import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import {SearchStruct} from '../search-structure';
import { ActivatedRoute , Router, NavigationEnd} from '@angular/router';
import { UrlService } from '../url.service';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  contents: Map<string, Content>;
  contentIds: string[];
  itemPrePage: number = 20;
  defaultSort : string = "createdAt";
  routerEvent: Subscription;
  constructor(private contentService: ContentService, private router: Router, private url: UrlService ) { 
    
  }
  convert2Int(value: any): number{
    if(typeof value === 'number'){
      return value;
    }
    if(typeof value === 'string' && (parseInt(value).toString() === value)){
      return parseInt(value);
    }
    return null;
  }

  convertUrl2Request(value: string) {
    let data = value.split('/');
    // /list/field/value
    // /list/field/value/sort
    // /list/field/value/2
    // /list/field/value/sort/3
    let result = {};
    if(data.length == 4){
      result['field'] = data[2];
      result['value'] = data[3];
    }else if(data.length == 5){
      let sort_page = this.convert2Int(data[4]);
      if(sort_page || sort_page === 0){
        result['field'] = data[2];
        result['value'] = data[3];
        result['page'] = sort_page;
      }else{
        result['field'] = data[2];
        result['value'] = data[3];
        result['sort'] =data[4];
      }
      // this.getContents(data[2], data[3], data[4]);
    }else if(data.length == 6){
      result['field'] = data[2];
      result['value'] = data[3];
      result['sort'] =data[4];
      result['page'] = this.convert2Int(data[5]);
    }
    return result;
  }

  getContents(field: string, value:string, sort:any, page:number){
    if(typeof sort !== 'string'){
      sort = 'createdAt';
    }
    if(!page || (typeof page === 'number' && page < 1)){
      page = 1;
    }
    let data_source = this.contentService.queryContents( field, value, sort, (page - 1) * this.itemPrePage, this.itemPrePage)
    if(data_source){
      data_source.subscribe(data=>{
        if(data){
          this.contents = data;
        }else{
          this.contents = new Map<string, Content>();
        }
        this.contentIds = Array.from(this.contents.keys());
      });
    }
  }

  ngOnInit() {
    console.log('[Home] On Init');
    let data = this.url.convertUrl2Request(this.router.url);
    
    
    this.routerEvent = this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      console.log('[Home] Nav from child control');
      if(evt.url.indexOf('/list/') !== -1){
        let data = this.convertUrl2Request(evt.url);
        this.getContents(data['field'], data['value'], data['sort'], data['page']);
      }
    });
    if(data['field'] && data['value']){
      
      if(data['sort'] && data['page']){
        this.getContents(data['field'], data['value'], data['sort'], data['page']);
      }else if(data['sort']){
        this.getContents(data['field'], data['value'], data['sort'], 1);
      }else if(data['page']){
        this.getContents(data['field'], data['value'], this.defaultSort, data['page']);
      }else{
        this.getContents(data['field'], data['value'], null, null);
      }
      // 
    }
  }
  ngOnDestroy(){
    this.routerEvent.unsubscribe();
    console.log(`[Home] On Destroy`);
  }

}
