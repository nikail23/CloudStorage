import { StorageElement, StorageElementType } from './../../services/storage.model';
import { SubscriptionsService } from './../../services/subscriptions.service';
import { StorageService } from './../../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public StorageElementType = StorageElementType;

  public sidenavOpened = false;

  public storageList: StorageElement[];

  constructor
  (
    private storageService: StorageService,
    private subscriptionService: SubscriptionsService
  ) { }

  ngOnInit(): void {
    const subscription = this.storageService.getAll().subscribe((storageList) => {
      this.storageList = storageList;
    });
    this.subscriptionService.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

}
