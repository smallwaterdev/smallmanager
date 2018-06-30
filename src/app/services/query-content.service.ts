import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Content } from '../content';
import { ErrorMessageService } from './error-message.service';

@Injectable({
  providedIn: 'root'
})
export class QueryContentService {

  contentCache: Map<string, Content>;

  smallData_manager_addr:string = "http://192.168.1.100:3001";
  constructor(private http: HttpClient, private errorMessage: ErrorMessageService) {
    
    console.log('[queryService] New Service Created');
    this.contentCache = new Map<string, Content>();
  }

  convertDataToContent(ele: Object): Content{
    let data = new Content();
    data.index = ele["index"];
    data.id = ele['_id'];
    data.indexUrl = ele['indexUrl'];
    data.domain = ele['domain'];
    data.imgSummaryUrl = ele['imgSummaryUrl'];
    data.imgPreviewUrls = ele['imgPreviewUrls'];
    data.title = ele['title']; 
    data.starnames= ele['starnames']; 
    data.genres = ele['genres']; 
    data.studio = ele['studio']; 
    data.director = ele['director']; 
    data.videoDomain = ele['videoDomain']; 
    data.videoUrl = ele['videoUrl']; 
    data.videoUrls = ele['videoUrls']; 
    data.duration = ele['duration']; 
    data.notes = ele['notes']; 
    data.view = ele['view']; 
    data.releaseDate = ele['releaseDate']; 
    data.favorite = ele['favorite']; 
    data.rating = ele['rating']; 
    data.status = ele['status']; 
    data.createdAt = ele['createdAt']; 
    data.updatedAt = ele['updatedAt']; 
    data.version = ele['__v'];
    return data;
  }
  queryFieldValueNumber(field: string, value: string):Observable<number>{
    console.log(`[queryService] queryFieldValueNumber ${field} ${value}`);
    const queryFieldValue: Observable<number> = new Observable((observer)=>{
      const httpObserver = {
        next: data => {
          
          if(data.success){
            observer.next(data.value[value]);
          }else{
            this.errorMessage.concat(data.reasons);
            observer.next(-1);
          }
        },
        error: err=>{
          observer.next(-1);
        }
      }
      value = encodeURIComponent(value);
      
      let queryUrl = `${this.smallData_manager_addr}/manage/query-meta/${field}/${value}`;
      let queryOpts = {headers:{token:"store_password"}};
      this.http.get<Object>(queryUrl, queryOpts).subscribe(httpObserver);
      return {unsubscribe() { }};
    });
    return queryFieldValue;
  }
  queryMeta(field: string): Observable<Object>{
    console.log(`[queryService] queryMeta on field ${field}`);
    const queryMeta: Observable<Object> = new Observable((observer)=>{
      const httpObserver = {
        next: data => {
          if(data.success){
            observer.next(data.value);
          }else{
            this.errorMessage.concat(data.reasons);
            observer.next(null);
          }
        },
        error: err=>{
          this.errorMessage.add(err.message);
          observer.next(null);
        }
      }
      let queryUrl = `${this.smallData_manager_addr}/manage/query-meta/${field}`;
      let queryOpts = {headers:{token:"store_password"}};
      this.http.get<Object>(queryUrl, queryOpts).subscribe(httpObserver);
      return {unsubscribe() { }};
    });
    return queryMeta;
  }
  queryContents(fields: string, values:string, sort: string, from: number, limit: number): Observable<Map<string, Content>>{
    if(!fields || !values || !sort || typeof from !== 'number' || typeof limit !== 'number'){
      return of(null);
    };
    console.log(`[queryService] queryContents ${fields} ${values} ${sort} ${from} ${limit}`);
    const fetchContents: Observable<Map<string, Content>> = new Observable((observer)=>{
      const httpObserver = {
        next: data => {
          if(data.success){
            let result: Map<string, Content> = new Map<string, Content>();
            data.value.forEach(ele=>{
              result.set(ele['_id'], this.convertDataToContent(ele));
            });
            this.contentCache = result;
            observer.next(result);
          }else{
            this.errorMessage.concat(data.reasons);
          }
        },
        error: err=>{
          this.errorMessage.add(err.message);
          observer.next(null);
        }
      }
      //field = encodeURIComponent(field);
      if(fields === 'indexUrl' || fields === 'videoUrl' || fields === 'notes'){
        values = encodeURIComponent(values);
      }
      let queryUrl = `${this.smallData_manager_addr}/manage/query/${fields}/${values}/${sort}/${from}/${limit}`;
      let queryOpts = {headers:{token:"store_password"}};
      this.http.get<Object[]>(queryUrl, queryOpts).subscribe(httpObserver);
      return {unsubscribe() { }};
    });
    return fetchContents;
  }

  queryContentById(useCache: boolean, id: string): Observable<Content>{
    
    let result: Content = this.contentCache.get(id);
    if(result && useCache){
      return of(result);
    }else{
      const fetchContentById: Observable<Content> = new Observable((observer)=>{
        const httpObserver = {
          next: data => {
            if(data.success){
              let result: Content = this.convertDataToContent(data.value[0]);
              this.contentCache.set(result.id, result);
              observer.next(result);
            }else{
              this.errorMessage.concat(data.reasons);
              observer.next(null);
            }
          },
          error: err=>{
            this.errorMessage.add(err.message);
            observer.next(null);
          }
        }
        let queryUrl = `${this.smallData_manager_addr}/manage/query/id/${id}`;
        let opts = {headers:{token:"store_password"}};
        this.http.get<Object[]>(queryUrl, opts).subscribe(httpObserver);
        return {unsubscribe() { }};
      });
      return fetchContentById;
    }
  }
}
