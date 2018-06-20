import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() { }
  convert2Int(value: any): number{
    if(typeof value === 'number'){
      return value;
    }
    if(typeof value === 'string' && (parseInt(value).toString() === value)){
      return parseInt(value);
    }
    return null;
  }
  convertUrl2Request(value: string) {
    let data = value.split('/');
    // /list/field/value
    // /list/field/value/sort
    // /list/field/value/2
    // /list/field/value/sort/3
    let result = {};
    if(data.length == 4){
      result['field'] = data[2];
      result['value'] = decodeURIComponent(data[3]);
    }else if(data.length == 5){
      let sort_page = this.convert2Int(data[4]);
      if(sort_page || sort_page === 0){
        result['field'] = data[2];
        result['value'] = decodeURIComponent(data[3]);
        result['page'] = sort_page;
      }else{
        result['field'] = data[2];
        result['value'] = decodeURIComponent(data[3]);
        result['sort'] =data[4];
      }
      // this.getContents(data[2], data[3], data[4]);
    }else if(data.length == 6){
      result['field'] = data[2];
      result['value'] = decodeURIComponent(data[3]);
      result['sort'] =data[4];
      result['page'] = this.convert2Int(data[5]);
    }
    return result;
  }
}
