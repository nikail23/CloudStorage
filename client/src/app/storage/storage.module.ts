import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { ListComponent } from './list/list.component';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule
  ],
  exports: [
    ListComponent
  ]
})
export class StorageModule { }
