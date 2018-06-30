import { Component, OnInit, COMPILER_OPTIONS } from '@angular/core';

@Component({
  selector: 'smallManager-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css']
})
export class ValidatorComponent implements OnInit {
  isOkToRun: boolean = true;
  constructor() { }
  error_message: string[][] = [];
  warning_message: string [][] = [];
  normal_message: string [] = [];
  counter: number = 0;

  videodomains: string [] = ['www.fembed.com', 'openload.co', 'rapidvideo.com'];
  domains: string[] = ['javseen.com', 'javfinder.is'];
  ngOnInit() {
  }
  done(){
    this.error_message.push(['', '-----------------']);
    this.warning_message.push(['', '-----------------']);
    this.normal_message.push('--------------------');
    this.counter = 0;
    this.isOkToRun = true;
  }
  toggle_start(field, value, from, limit){
    /*if(parseInt(limit) <= 0 || parseInt(from) < 0){
      return;
    }
    this.isOkToRun = false;
    this.report_normal('Start');
    this.contentService.queryContents(field, value, "createdAt", parseInt(from), parseInt(limit)).subscribe(result=>{
      if(field === 'domain'){
        
        result.forEach(content=>{
          this.valid_content_by_domain(content);
        });
        this.report_normal('End. Actual verified items number: ' + this.counter + '.');
      }else if(field === 'videoDomain'){
        result.forEach(content=>{
          
          this.valid_content_by_video_domain(content);
        });
      }
      this.done();
      
    });*/
  }
  report_error(id: string, message: string){
    this.error_message.push([id, message]);
  }
  report_warning(id: string, message: string){
    this.warning_message.push([id, message]);
  }
  report_normal(message: string){
    this.normal_message.push(message);
  }
  valid_content_by_video_domain(content){
    // 1. check domain, videoDomain, videoUrl, and Notes
    this.counter++;
    switch(content.videoDomain){
      case "www.fembed.com":{
        if(content.domain.indexOf('javfinder.is') ===-1){
          // openload
          if(content.domain.indexOf('javseen.com') !==-1){
            if(content.notes === ''){
              this.report_warning(content.id, `${content.id} loose old link`);
            }
          }else{
            this.report_error(content.id, `${content.id} error`);
          }
        }
      };break;

      case "openload.co":{
        if(content.videoUrl.indexOf('openload.co') ===-1){
          // openload.co => www.fembed.com
          this.report_error(content.id, `${content.id} error`)
        }
      };break;

      default: break;
    }
  }
  
  valid_content_by_domain(content){
    // 1. check domain, videoDomain, videoUrl, and Notes
    this.counter++;
    switch(content.domain){
      case "javseen.com":{
        
        if(content.videoDomain === "www.fembed.com"){
          if(content.videoUrl.indexOf('www.fembed.com') !== -1){
            if(content.notes === ''){
              this.report_warning(content.id, `loss old link`);
            }
          }
        }
      };break;


      default: break;
    }
  }

}
