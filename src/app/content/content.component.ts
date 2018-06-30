import { Component, OnInit, Input, Output} from '@angular/core';
import { QueryContentService } from '../services/query-content.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UpdateContentService} from '../services/update-content.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Content, VideoUrl } from '../content';
import {ErrorMessageService} from '../services/error-message.service';
@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  
  contentId: string;
  content: Content;

  isShowPreviewPictures: boolean;
  Pictures_Button_Text: string;

  currentUrl:string;
  isShowFrame : boolean;

  //isEnableExtension: boolean;

  currentUpdatingItem = {};

  showUpdateMessage: boolean = false;
  showRemoveMessage: boolean = false;
  isEditing: boolean = false;
  modify_content: string;
  constructor(
    private queryService: QueryContentService, 
    private updateService: UpdateContentService,
    private sanitizer: DomSanitizer, 
    private route: ActivatedRoute,
    private location: Location,
    private errorMsg: ErrorMessageService) { 

    this.contentId = this.route.snapshot.paramMap.get('id');
    this.isShowPreviewPictures = false;
    this.Pictures_Button_Text = "Show";
    this.currentUrl = null;
    this.isShowFrame = false;
    //this.isEnableExtension = true;

    this.currentUpdatingItem = {}

  }
  convertDuration(value:number){
    let hour = "00";
    let minute = "00";
    let second = "00";
    if(value < 60){
      second = value.toString();
    }else if(value < 3600){
      second = (value % 60).toString();
      minute = Math.floor(value / 60).toString();
      
    }else{
      second = (value % 60).toString();
      let temp = Math.floor(value / 60);
      hour = Math.floor(temp / 60).toString();
      minute = (temp % 60).toString();
    }  
    if(hour.length < 2){
      hour = '0' + hour;
    }
    if(minute.length < 2){
      minute = '0' + minute;
    }
    if(second.length < 2){
      second = '0' + second;
    }
    return hour + ":" + minute + ":" + second;
    
  }

  getContent(useCache: boolean): void{
    this.queryService.queryContentById(useCache, this.contentId).subscribe(data=>{
      this.content = data;
      this.modify_content = JSON.stringify(this.content, null, 2);
      
    });
  }
  ngAfterViewChecked(){
    let ready = document.getElementById('extension-mounting-point');
      if(ready){
        ready.click();
      }
  }
  ngOnInit() {
    this.getContent(true);
    console.log(`[ContentList] On Init`);
  }
  togglePreviewPictures(){
    this.isShowPreviewPictures = !this.isShowPreviewPictures;
    if(this.isShowPreviewPictures){
      this.Pictures_Button_Text = "Hide";
    }else{
      this.Pictures_Button_Text = "Show";
    }
  }
  playVideo(videoUrl: VideoUrl){
    if(this.currentUrl){
      this.currentUrl = null;
    }else{
      this.currentUrl = videoUrl.videoUrl;
    }
  }
  toggleVideoFrame(){
    this.isShowFrame = !this.isShowFrame;
  }
  getFrameUrl(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.content.videoUrl);
  }

  // function for updating
  
  enableInput(value){
    this.showUpdateMessage = false;
    this.currentUpdatingItem[value] = true;
  }
  updateValue(field, value){
    this.currentUpdatingItem[field] = false;
    this.content.update(field, value);
  }

  edit_commit(){
    if(!this.isEditing){
      this.isEditing = true;
    }else{
      this.updateService.updateContentById(this.content.id, JSON.parse(this.modify_content)).subscribe(
        ele=>{ console.log(ele); this.showUpdateMessage = true;},
        err=>{ this.errorMsg.add(err.message);}
      );
    }
  }
  remove(){
    this.updateService.removeContentById(this.content.id).subscribe(
      ele=>{ console.log(ele); this.showRemoveMessage = true;},
      err=>{ this.errorMsg.add(err.message);}
    );
  }
  refresh(){
    this.getContent(false);
  }
}
