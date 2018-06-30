import { Component, OnInit } from '@angular/core';
import { QueryContentService } from '../services/query-content.service';
import { UpdateMetaCacheService } from '../services/update-meta-cache.service';
import { NormalizeService} from '../services/normalize.service';
@Component({
  selector: 'smallmanager-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.css']
})
export class MetaComponent implements OnInit {
  
  fields: string[] = ['genre', 'videoDomain', 'domain', 'studio', 'director', 'starname'];
  updatable_fields: string [] = ['genre', 'studio', 'director', 'starname'];
  meta: Map<string, Object>;
  keys: Map<string, string[]>;
  disable_update: boolean = true;
  constructor(
    private querService: QueryContentService,
    private metaCacheService: UpdateMetaCacheService,
    private normalizeService: NormalizeService
  ) { 
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
  isUpdatable(field){
    return (this.updatable_fields.indexOf(field) !== -1);
  }
  updateField(field, oldValue, newValue){
    if(this.disable_update){
      alert('Please enable update');
      return;
    }
    this.normalizeService.batchUpdateField(field,oldValue, newValue).subscribe(
      result=>{
        alert(JSON.stringify(result));
      }
    );
  }
  toggle_update(){
    this.disable_update = !this.disable_update;
  }
  deleteField(field:string, value:string){
    if(this.disable_update){
      alert('Please enable update');
      return;
    }
    this.normalizeService.batchDeleteField(field, value).subscribe(
      result=>{
        alert(JSON.stringify(result));
      }
    );
  }
  updateEffective(item, isOn){
    /*if(this.disable_update){
      alert('Please enable update');
      return;
    }
    this.contentService.batchUpdateFieldByAnother('videoDomain', item, 'effective', isOn).subscribe(result=>{
      alert(JSON.stringify(result));
    });*/
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
      this.querService.queryMeta(field).subscribe(data=>{
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
  normalizeMetaCache(field, value){
    /*this.contentService.normalizeMetaCache(field, value).subscribe(data=>{
      console.log(data);
    });*/
  }


  // metacache
  updateMetaCache(field: string){
    this.metaCacheService.updateMetaCache(field).subscribe(
      data=>{
        alert(JSON.stringify(data));
      }
    );
  }
  removeMetaCache(field: string, name: string){
    this.metaCacheService.removeMetaCache(field, name).subscribe(
      data=>{
        alert(JSON.stringify(data));
      }
    );
  }
  uploadProfile(field: string, name: string, url: string){
    this.metaCacheService.uploadProfileUrl(field, name, url).subscribe(
      data=>{
        alert(JSON.stringify(data));
      }
    );
  }
  updateMetaCacheALL(){
    this.metaCacheService.updateMetaCacheMetaALL().subscribe(
      data=>{
        alert(JSON.stringify(data));
      }
    );
  }
}
