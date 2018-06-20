import { Component, OnInit } from '@angular/core';
import { ContentService } from '../content.service';

@Component({
  selector: 'smallmanager-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.css']
})
export class MetaComponent implements OnInit {
  
  fields: string[] = ['genre', 'videoDomain', 'domain', 'studio', 'director', 'starname'];
  meta: Map<string, Object>;
  keys: Map<string, string[]>;
  
  constructor(private contentService: ContentService) { 
    this.meta = new Map<string, Object>();
    this.keys = new Map<string, string[]>();
  }
  ngOnInit(){
    this.fields.forEach(field=>{
      this.meta.set(field, {});
      this.keys.set(field, []);
    });
    this.fields.forEach(field=>{
      this.refreshMeta(field, this.meta, this.keys);
    })
  }
  captalize(value: string){
    if(value && value.length > 1){
      value = value[0].toUpperCase() + value.substring(1, value.length).toLowerCase();
      return value;
    }else if(value && value.length === 1){
      return value.toUpperCase();
    }
  }
  refreshAll(){
    let meta_t: Map<string, Object> = new Map<string, Object>();
    let keys_t: Map<string, string[]> = new Map<string, string[]>();
    this.fields.forEach(field=>{
      meta_t.set(field, {});
      keys_t.set(field, []);
    });
    this.fields.forEach(field=>{
      this.refreshMeta(field, meta_t, keys_t);
    })
    this.meta = meta_t;
    this.keys = keys_t;
  }
  refreshMeta(field:string, meta: Map<string, Object>, keys: Map<string, string[]>){
    if(this.fields.indexOf(field) !== -1){
      this.contentService.queryMeta(field).subscribe(data=>{
        if(data){
          let key = Object.keys(data);
          let sort_key = [];
          key.forEach((ele)=>{
            sort_key.push([ele, data[ele]]);
          })
          sort_key.sort((a, b)=>{return b[1]- a[1]});
          let result = [];
          sort_key.forEach(ele=>{
            result.push(ele[0]);
          });
          meta.set(field, data);
          keys.set(field, result);
          
        }else{
          meta.set(field, {});
          keys.set(field, []);
        }
      });
    }
  }
}
