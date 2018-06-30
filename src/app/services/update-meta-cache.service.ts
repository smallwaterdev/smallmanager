import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { ErrorMessageService } from './error-message.service';
import {smallData_manager_addr} from './config';
@Injectable({
  providedIn: 'root'
})
export class UpdateMetaCacheService {

  smallData_manager_addr:string = smallData_manager_addr;
  constructor(private http: HttpClient, private errorMessage: ErrorMessageService) {
    
    console.log('[metaCache] New Service Created');
   
  }

  __generateHandler(observer){
    let httpObserver = {
      next: data=>{
        if(!data.success){
          this.errorMessage.concat(data.reasons);
          observer.next(null);
        }else{
          observer.next(data);
        }
      },
      error: err=>{
        this.errorMessage.add(err.message);
        observer.next(null);
      }
    };
    return httpObserver;
  }
  removeMetaCache(field: string, name: string): Observable<Object>{
    const removeMeta: Observable<Object> = new Observable((observer)=>{
      this.http.delete(
        `${this.smallData_manager_addr}/metacache/remove/${field}/${name}`,
        {headers:{token: 'store_password'}}
      ).subscribe(this.__generateHandler(observer));
      return {unsubscribe(){}};
    }); 
    return removeMeta;
  }
  uploadProfileUrl(field: string, name: string, url: string): Observable<Object>{
    const uploadProfile: Observable<Object> =  new Observable((observer)=>{
      this.http.put(
        `${this.smallData_manager_addr}/metacache/setprofile/${field}/${name}`,
        {profile_url: url},
        {headers:{token: 'store_password'}}
      ).subscribe(this.__generateHandler(observer));
      return {unsubscribe(){}};
    });
    return uploadProfile;
  }
  updateMetaCache(field: string): Observable<Object>{
    const updateMeta: Observable<Object> = new Observable((observer)=>{
      this.http.put(
        `${this.smallData_manager_addr}/metacache/update/${field}`,
        {},
        {headers:{token: 'store_password'}}
      ).subscribe(this.__generateHandler(observer));
      return {unsubscribe(){}};
    }); 
    return updateMeta;
    ;
  }
  updateMetaCacheMetaALL(): Observable<Object>{
    const updateMeta: Observable<Object> = new Observable((observer)=>{
      this.http.put(
        `${this.smallData_manager_addr}/metacache/all`,
        {},
        {headers:{token: 'store_password'}}
      ).subscribe(this.__generateHandler(observer));
      return {unsubscribe(){}};
    }); 
    return updateMeta;
    ;
  }
}
