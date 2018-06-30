import { Component, OnInit } from '@angular/core';
import { ErrorMessageService } from '../services/error-message.service';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(public errorMsg: ErrorMessageService) { }

  ngOnInit() {
  }

}
