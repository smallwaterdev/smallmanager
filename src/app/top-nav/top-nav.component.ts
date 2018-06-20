import { Component, OnInit } from '@angular/core';
import { ContentService} from '../content.service';
import { ErrorMessageService } from '../error-message.service';
import {Location} from '@angular/common';
@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  constructor(private contentService: ContentService, private error: ErrorMessageService, private location: Location) { }

  ngOnInit() {
  }
  searchId(value: string){
    this.contentService.queryContentById(true, value).subscribe(content=>{
      if(content){
        // open content url
        this.location.go(`/content/${value}`);
      }else{
        this.error.add(`${value} not found.`);
      }
    });
  }
}
