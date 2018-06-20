import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Content } from './content';
import { ErrorMessageService } from './error-message.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  contents: Map<string, Content>;
  // errorMsg: string;

  constructor(private http: HttpClient, private errorMessage: ErrorMessageService) {
    
    console.log('[ContentService] New Service Created');
    this.contents = new Map<string, Content>();
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
    data.effective = ele['effective']; 
    data.createdAt = ele['createdAt']; 
    data.updatedAt = ele['updatedAt']; 
    data.version = ele['__v'];
    return data;
  }

  getUpdatableFields(content: Content){
    return {
        imgPreviewUrls: content.imgPreviewUrls,
        genres: content.genres,
        index: content.index,
        imgSummaryUrl: content.imgSummaryUrl,
        effective: content.effective,
        rating: content.rating,
        favorite: content.favorite,
        releaseDate: content.releaseDate,
        view: content.view,
        notes: content.notes,
        duration: content.duration,
        videoUrl:content.videoUrl,
        videoDomain: content.videoDomain,
        director: content.director,
        studio:content.studio,
        title: content.title,
        videoUrls: content.videoUrls,
        starnames:content.starnames
    };
  }

  updateContentById(id: string, content: Content): Observable<any>{
    return this.http.put(
      `https://localhost:3444/manage/update/${id}`,
      this.getUpdatableFields(content),
      {
        headers:{
          token: 'store_password'
        }
      }
    );
  }

  removeContentById(id: string): Observable<any>{
    return this.http.delete(
      `https://localhost:3444/manage/remove/${id}`,
      {
        headers:{
          token: 'store_password'
        }
      }
    );
  }
  queryContents(field: string, value:string, sort: string, from: number, limit: number): Observable<Map<string, Content>>{
    if(!field || !value || !sort || typeof from !== 'number' || typeof limit !== 'number'){
      return null;
    };
    console.log(`[ContentService] queryContents ${field} ${value} ${sort} ${from} ${limit}`);
    const fetchContents: Observable<Map<string, Content>> = new Observable((observer)=>{
      const httpObserver = {
        next: data => {
          let result: Map<string, Content> = new Map<string, Content>();
          data.forEach(ele=>{
            result.set(ele['_id'], this.convertDataToContent(ele));
          });
          this.contents = result;
          observer.next(result);
        },
        error: err=>{
          this.errorMessage.add(err.message);
          observer.next(null);
        }
      }
      //field = encodeURIComponent(field);
      if(field === 'indexUrl'){
        value = encodeURIComponent(value);
      }
      let queryUrl = `https://localhost:3444/manage/query/${field}/${value}/${sort}/${from}/${limit}`;
      let queryOpts = {headers:{token:"store_password"}};
      this.http.get<Object[]>(queryUrl, queryOpts).subscribe(httpObserver);
      return {unsubscribe() { }};
    });
    return fetchContents;
  }

  queryContentById(useCache: boolean, id: string): Observable<Content>{
    
    let result: Content = this.contents.get(id);
    if(result && useCache){
      return of(result);
    }else{
      const fetchContentById: Observable<Content> = new Observable((observer)=>{
        const httpObserver = {
          next: data => {
            let result: Content = this.convertDataToContent(data[0]);
            // cache
            this.contents.set(result.id, result);
            observer.next(result);
          },
          error: err=>{
            this.errorMessage.add(err.message);
            observer.next(null);
          }
        }
        let queryUrl = `https://localhost:3444/manage/query/id/${id}`;
        let opts = {headers:{token:"store_password"}};
        this.http.get<Object[]>(queryUrl, opts).subscribe(httpObserver);
        return {unsubscribe() { }};
      });
      return fetchContentById;
    }
  }

  /**
   * 
   * @param field e.g. domain, videoDomain
   * @param value e.g. javseen.com, fembedded.com
   */
  queryFieldValueNumber(field: string, value: string):Observable<Object>{
    console.log(`[ContentService] queryFieldValueNumber ${field} ${value}`);
    const fetchContents: Observable<Object> = new Observable((observer)=>{
      const httpObserver = {
        next: data => {
          observer.next(data);
        },
        error: err=>{
          observer.next(null);
        }
      }
      value = encodeURIComponent(value);
      
      let queryUrl = `https://localhost:3444/manage/query-meta/${field}/${value}`;
      let queryOpts = {headers:{token:"store_password"}};
      this.http.get<Object>(queryUrl, queryOpts).subscribe(httpObserver);
      return {unsubscribe() { }};
    });
    return fetchContents;
  }

  queryMeta(value: string): Observable<Object>{
    console.log(`[ContentService] queryMeta ${value}`);
    const fetchContents: Observable<Object> = new Observable((observer)=>{
      const httpObserver = {
        next: data => {
          observer.next(data);
        },
        error: err=>{
          this.errorMessage.add(err.message);
          observer.next(null);
        }
      }
      value = encodeURIComponent(value);
      let queryUrl = `https://localhost:3444/manage/query-meta/${value}`;
      let queryOpts = {headers:{token:"store_password"}};
      this.http.get<Object>(queryUrl, queryOpts).subscribe(httpObserver);
      return {unsubscribe() { }};
    });
    return fetchContents;
  }
}
