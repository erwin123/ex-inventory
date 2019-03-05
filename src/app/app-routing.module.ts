import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './com/login/login.component';
import { LandingComponent } from './com/landing/landing.component';
import { MainComponent } from './com/main/main.component';
import { AuthguardService } from './services/authguard.service';
import { OpnameComponent } from './com/opname/opname.component';
import { OutComponent } from './com/out/out.component';
import { BackComponent } from './com/back/back.component';
import { MasterComponent } from './com/master/master.component';
import { MasterListComponent } from './com/master-list/master-list.component';
import { HistoryassetComponent } from './com/historyasset/historyasset.component';

const routes: Routes = [
  {
    path: 'main', component: MainComponent,
    children: [
      { path: 'landing', component: LandingComponent, canActivate: [AuthguardService], data: { state: 'landing' } },
      { path: 'opname', component: OpnameComponent, canActivate: [AuthguardService], data: { state: 'opname' } },
      { path: 'out', component: OutComponent, canActivate: [AuthguardService], data: { state: 'out' } },
      { path: 'history', component: HistoryassetComponent, canActivate: [AuthguardService], data: { state: 'historyasset' } },
      { path: 'back', component: BackComponent, canActivate: [AuthguardService], data: { state: 'back' } },
      { path: 'master-list', component: MasterListComponent, canActivate: [AuthguardService], data: { state: 'masterlist' } },
      { path: 'master', loadChildren: './com/master/master.module#MasterModule', canActivate: [AuthguardService], data: { state: 'master' } },
      { path: 'login', component: LoginComponent, data: { state: 'login' } },
    ]
  },
  //{ path: '', redirectTo: 'main/landing'},
  // otherwise redirect to home
  { path: '**', redirectTo: 'main/landing' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
