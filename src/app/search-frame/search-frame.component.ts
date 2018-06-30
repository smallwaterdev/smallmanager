import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {  Router } from '@angular/router';
import { UrlService} from '../services/url.service';
@Component({
  selector: 'search-frame',
  templateUrl: './search-frame.component.html',
  styleUrls: ['./search-frame.component.css']
})
export class SearchFrameComponent implements OnInit {

  // @Output('search') searchEvent = new EventEmitter<Object>();
  supportFields: string[] = ["id", "notes", "videoUrl", "domain", "index",  "indexUrl", "genre",  "starname","director", "studio", "videoDomain"];
  supportSorts: string[] = ['view', 'rating', 'duration','favorite', 'releaseDate'];
  supportSortsOn: string [] = ["domain",   "genre",  "starname","director", "studio", "videoDomain" ];
  currentField: string = this.supportFields[0];
  currentValue: string = null;
  currentSort: string = null;
  disable_sort: boolean;
  constructor(private router: Router, private url: UrlService) { }

  ngOnInit() {
    // 1. open from a link  e.g. click http://localhost:4200/list/genre/big-tits
    // or 2. open from http://localhost:4200
    
    //if(this.router.url.indexOf('/list/') !== -1){
      let data = this.url.convertUrl2Request(this.router.url);
      console.log(data);
      if(data['field'] && data['value']){
        this.currentField = data['field'];
        this.currentValue = data['value'];
        if(this.supportSortsOn.indexOf(data['field']) === -1){
          this.disable_sort = true;
        }else{
          this.disable_sort = false;
        }
        if(data['sort']){
          this.currentSort = data['sort'];
        }else{
          this.currentSort = "releaseDate";
        }
      }
    //}
  }
  search(field: string, value: string){
    if(this.currentSort){
      this.router.navigate(['/list',field, value , this.currentSort]);
    }else{
      this.router.navigate(['/list',field, value]);
    }

  }
  sort(sort: string){
    if(sort === this.currentSort){
      return;
    }
    this.currentSort = sort;
    // 1. use the frame to search and then sort
    if(this.currentValue){
      this.router.navigate(['/list',this.currentField, this.currentValue, sort]);
    }
  }

  capitalize(value: string){
    if(value.length <= 1){
      return value.toUpperCase();
    }else{
      let result = value[0].toUpperCase() + value.substring(1, value.length).toLowerCase();
      return result;
    }
  }
  changeField(btn){
    this.currentField = btn.value;
    if(this.supportSortsOn.indexOf(this.currentField) === -1){
      this.disable_sort = true;
    }else{
      this.disable_sort = false;
    }
  }
}
