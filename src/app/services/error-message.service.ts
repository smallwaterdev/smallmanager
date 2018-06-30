import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  messages: string [] = [];
  constructor() { }
  add(message: string){
    this.messages.push(message);
  }
  concat(message:string[]){
    this.messages = this.messages.concat(message);
  }
  clear(){
    this.messages = [];
  }
}
