import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';


@NgModule({
  declarations: [MasterComponent],
  imports: [
    CommonModule,
    MasterRoutingModule,
    ClarityModule,
    FormsModule,
    MyDatePickerModule
  ]
})
export class MasterModule { }
