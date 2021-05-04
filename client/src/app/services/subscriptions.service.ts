import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  private subscriptions: Array<Subscription>;

  constructor() {
    this.subscriptions = [];
  }

  push(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  unsubscribeAll() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }
}
