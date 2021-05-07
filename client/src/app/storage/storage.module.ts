import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { ListComponent } from './list/list.component';
import { DeleteComponent } from './list/delete/delete.component';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  exports: [ListComponent],
  providers: [],
})
export class StorageModule {}
