import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Content } from '../content';
import { ErrorMessageService } from './error-message.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateContentService {
  smallData_manager_addr:string = "http://192.168.1.100:3001";
  constructor(private http: HttpClient, private errorMessage: ErrorMessageService) {
    
    console.log('[ContentService] New Service Created');
   
  }
  removeContentById(id: string): Observable<any>{
    return this.http.delete(
      `${this.smallData_manager_addr}/manage/remove/${id}`,
      {
        headers:{
          token: 'store_password'
        }
      }
    );
  }
  getUpdatableFields(content: Content){
    return {
        imgPreviewUrls: content.imgPreviewUrls,
        genres: content.genres,
        index: content.index,
        imgSummaryUrl: content.imgSummaryUrl,
        status: content.status,
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
      `${this.smallData_manager_addr}/manage/update/${id}`,
      this.getUpdatableFields(content),
      {
        headers:{
          token: 'store_password'
        }
      }
    );
  }
}
