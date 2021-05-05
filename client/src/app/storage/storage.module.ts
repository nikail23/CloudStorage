import { RippleService } from './../services/ripple.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { ListComponent } from './list/list.component';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatProgressBarModule
  ],
  exports: [
    ListComponent
  ],
  providers: [
    {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useExisting: RippleService}
  ]
})
export class StorageModule { }
