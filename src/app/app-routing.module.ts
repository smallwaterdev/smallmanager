import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule, Route} from '@angular/router';

import {ContentComponent} from './content/content.component';
import { HomeComponent } from './home/home.component';
import {NotFoundComponent} from './not-found/not-found.component';
import { MetaComponent } from './meta/meta.component';
import {HomepageComponent} from './homepage/homepage.component';
import {UrlSegment} from '@angular/router';
import {ValidatorComponent} from './validator/validator.component';
export function list_matcher(url: UrlSegment[]) {
  if(url.length >= 1 && url[0].path === 'list'){
    return {consumed: url};
  }else{
    return null;
  }
}
const routes: Route []= [
  {path: 'content/:id', component: ContentComponent},
  {path: 'meta', component: MetaComponent},
  {path: 'validator', component: ValidatorComponent},
  {matcher: list_matcher, component: HomeComponent},
  {path: '', component: HomepageComponent},
  {path: '**', component: NotFoundComponent}
  
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})

export class AppRoutingModule { }
