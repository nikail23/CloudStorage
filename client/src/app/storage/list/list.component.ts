import { ProgressHelper } from './progressHelper';
import { StorageElement, StorageElementType } from './../../services/storage.model';
import { SubscriptionsService } from './../../services/subscriptions.service';
import { StorageService } from './../../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpEventType, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public StorageElementType = StorageElementType;

  public sidenavOpened = false;
  public storageList: StorageElement[];
  public progressHelper: ProgressHelper;

  constructor
  (
    private storageService: StorageService,
    private subscriptionService: SubscriptionsService
  ) { }

  ngOnInit(): void {
    this.loadStorageList();
    this.progressHelper = new ProgressHelper();
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  public loadStorageList(): void {
    const subscription = this.storageService.getAll().subscribe((storageList) => {
      this.storageList = storageList;
    });
    this.subscriptionService.push(subscription);
  }

  public uploadFile() {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', event => {
        const target = event.target as HTMLInputElement;
        const file = target.files[0];
        this.storageService.sendFile(file).subscribe((event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.progressHelper.startFileLoading();
              break;
            case HttpEventType.UploadProgress:
              const loaded = Math.round(event.loaded / 1024);
              const percent = Math.round((event.loaded * 100) / event.total);
              this.progressHelper.updateLoadedAndPercent(loaded, percent);
              break;
            case HttpEventType.Response:
              this.progressHelper.endFileLoading();
              this.loadStorageList();
          }
        });
    });
    fileInput.click();
    fileInput = null;
  }

  public uploadFolder() {

  }

  public toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  public delete(event, id) {
    if (event.target.outerText === 'delete') {
      console.log(event)
    }
  }

  public download(event, id) {
    if (event.target.outerText === 'download') {
      this.storageService.downloadFile(id, this.storageList[id].name);
    }
  }

  public tryOpen(event, id) {
    if (event.target.outerText !== 'download' && event.target.outerText !== 'delete') {

    }
  }
}
