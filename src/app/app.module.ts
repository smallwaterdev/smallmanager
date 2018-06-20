import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ContentComponent } from './content/content.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';
import { GalleryComponent } from './gallery/gallery.component';
import { VideoFrameComponent } from './video-frame/video-frame.component';
import { AppRoutingModule } from './/app-routing.module';
import { ContentlistComponent } from './contentlist/contentlist.component';
import { SearchFrameComponent } from './search-frame/search-frame.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MetaComponent } from './meta/meta.component';
import { LastNextBtnComponent } from './last-next-btn/last-next-btn.component';
import { HomepageComponent } from './homepage/homepage.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatGridListModule} from '@angular/material/grid-list';
@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    GalleryComponent,
    VideoFrameComponent,
    ContentlistComponent,
    SearchFrameComponent,
    HomeComponent,
    ErrorComponent,
    TopNavComponent,
    
    NotFoundComponent,
    
    MetaComponent,
    
    LastNextBtnComponent,
    
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,

    MatButtonModule, 
    MatCheckboxModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
