import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { ListComponent } from './list/list.component';
import { DeleteComponent } from './list/delete/delete.component';
import { AuthComponent } from './auth/auth.component';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListComponent, DeleteComponent, AuthComponent],
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
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  exports: [ListComponent, AuthComponent],
  providers: [],
})
export class StorageModule {}
