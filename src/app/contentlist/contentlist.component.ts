import { Component, OnInit, Input } from '@angular/core';

import { Content} from '../content';
@Component({
  selector: 'contentlist',
  templateUrl: './contentlist.component.html',
  styleUrls: ['./contentlist.component.css']
})
export class ContentlistComponent implements OnInit {
  @Input() contents: Map<string, Content>;
  @Input() contentIds: string[];
  constructor() { 
    
  }
  ngOnInit(){
    
  }
  

}
