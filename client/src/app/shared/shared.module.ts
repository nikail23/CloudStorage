import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesModule } from './../services/services.module';

import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatMenuModule,
    MatDialogModule
  ],
  exports: [
    HeaderComponent,
    ErrorComponent
  ],
  providers: [
    ServicesModule
  ]
})
export class SharedModule { }
