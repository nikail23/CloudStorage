import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { ListComponent } from './list/list.component';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DeleteComponent } from './list/delete/delete.component';

@NgModule({
  declarations: [ListComponent, DeleteComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [ListComponent],
  providers: [],
})
export class StorageModule {}
