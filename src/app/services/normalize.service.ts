import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ErrorMessageService } from './error-message.service';

@Injectable({
  providedIn: 'root'
})
export class NormalizeService {

  smallData_manager_addr:string = "http://192.168.1.100:3001";
  constructor(private http: HttpClient, private errorMessage: ErrorMessageService) {
    console.log('[NormalizeService] New Service Created');
  }
  batchDeleteField(field: string, value: string):Observable<Object>{
    console.log(`[NormalizeService] batchDeleteField ${field} delete ${value}`);
    const normalizeRemove: Observable<Object> = new Observable((observer)=>{
      const httpObserver = {
        next: data => {
          observer.next(data);
        },
        error: err=>{
          this.errorMessage.add(err.message);
          observer.next(null);
        }
      }
      this.http.delete(
        `${this.smallData_manager_addr}/normalize/remove/${field}/${value}`,
        {
          headers:{
            token: 'store_password'
          }
        }
      ).subscribe(httpObserver);
      return {unsubscribe() { }};
    });
    return normalizeRemove;
  }
  batchUpdateField(field: string, oldValue: string, newValue: string):Observable<Object>{
    console.log(`[NormalizeService] batchUpdateField ${field} from ${oldValue} to ${newValue}`);
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
      this.http.put(
        `${this.smallData_manager_addr}/normalize/update/${field}/${oldValue}/${newValue}`,
        {},
        {
          headers:{
            token: 'store_password'
          }
        }
      ).subscribe(httpObserver);
      return {unsubscribe() { }};
    });
    return fetchContents;
  }
}
