import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { ReactiveFormsModule }    from '@angular/forms';

import { JwtInterceptor} from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';

import { routing }        from './app.routing';

import { AppComponent } from './app.component';
import { PingComponent } from './ping/ping.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin_parts/index/admin.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

import { IconsModule } from './_icons/icons.module';
import { AdminTopicModalComponent } from './components/admin_parts/topic-modal/admin-topic-modal.component';


import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


import { NgHttpLoaderModule } from 'ng-http-loader';
import {NgxPaginationModule} from "ngx-pagination";
import { AdminSubsComponent } from './components/admin_parts/subs/admin-subs.component';
import { IndexCardComponent } from './components/admin_parts/index-card/index-card.component';
import { SubCardComponent } from './components/admin_parts/sub-card/sub-card.component';
import { SearchComponent } from './components/admin_parts/search/search.component';
import { ScriptureListComponent } from './components/home_parts/scripture-list/scripture-list.component';
import { RedirectModalSubComponent } from './components/admin_parts/redirect-modal-sub/redirect-modal-sub.component';
import {RedirectModalIndexComponent} from "./components/admin_parts/redirect-modal-index/redirect-modal-index.component";
import { ScriptureModalSubComponent } from './components/admin_parts/scripture-modal-sub/scripture-modal-sub.component';
import { ScriptureModalIndexComponent } from './components/admin_parts/scripture-modal-index/scripture-modal-index.component';


@NgModule({
  declarations: [
    AppComponent,
    PingComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    AdminTopicModalComponent,
    AdminSubsComponent,
    IndexCardComponent,
    SubCardComponent,
    SearchComponent,
    ScriptureListComponent,
    RedirectModalIndexComponent,
    RedirectModalSubComponent,
    ScriptureModalSubComponent,
    ScriptureModalIndexComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    routing,
    IconsModule,
    AngularEditorModule,
    NgxPaginationModule,
    NgHttpLoaderModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
