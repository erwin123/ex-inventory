import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './com/login/login.component';
import { MainComponent } from './com/main/main.component';
import { LandingComponent } from './com/landing/landing.component';
import { HeaderComponent } from './com/header/header.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AuthguardService } from './services/authguard.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { OutComponent } from './com/out/out.component';
import { BackComponent } from './com/back/back.component';
//import { MasterComponent } from './com/master/master.component';
import { OpnameComponent } from './com/opname/opname.component';
import { MyDatePickerModule } from 'mydatepicker';
import { MasterListComponent } from './com/master-list/master-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ToastrModule } from 'ngx-toastr';
import { HistoryassetComponent } from './com/historyasset/historyasset.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    LandingComponent,
    HeaderComponent,
    OutComponent,
    BackComponent,
    //MasterComponent,
    OpnameComponent,
    MasterListComponent,
    HistoryassetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MyDatePickerModule,
    NgSelectModule,
    ZXingScannerModule,
    ToastrModule.forRoot(),
  ],
  providers: [AuthguardService, {provide: LocationStrategy, useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
