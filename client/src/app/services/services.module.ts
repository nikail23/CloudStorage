import { UserService } from './user.service';
import { SubscriptionsService } from './subscriptions.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    UserService,
    SubscriptionsService
  ]
})
export class ServicesModule { }
