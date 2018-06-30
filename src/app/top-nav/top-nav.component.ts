import { Component, OnInit } from '@angular/core';
import { ErrorMessageService } from '../services/error-message.service';
import {Location} from '@angular/common';
@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  constructor(private error: ErrorMessageService, private location: Location) { }

  ngOnInit() {
  }
  searchId(value: string){
    /*this.contentService.queryContentById(true, value).subscribe(content=>{
      if(content){
        // open content url
        this.location.go(`/content/${value}`);
      }else{
        this.error.add(`${value} not found.`);
      }
    });*/
  }
}
