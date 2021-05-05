import { StorageElement, StorageElementType } from './../../services/storage.model';
import { SubscriptionsService } from './../../services/subscriptions.service';
import { StorageService } from './../../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public StorageElementType = StorageElementType;

  public sidenavOpened = false;

  public storageList: StorageElement[];

  public isFileLoading = false;

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

  public uploadFile() {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', event => {
        const target = event.target as HTMLInputElement;
        const file = target.files[0];
        this.storageService.sendFile(file).subscribe((event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.isFileLoading = true;
              console.log('Request sent!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header received!');
              break;
            case HttpEventType.UploadProgress:
              const kbLoaded = Math.round(event.loaded / 1024);
              const percent = Math.round((event.loaded * 100) / event.total);
              console.log(
                `Upload in progress! ${kbLoaded}kB loaded (${percent}%)`
              );
              break;
            case HttpEventType.Response:
              console.log('Done!', event.body);
              this.isFileLoading = false;
              fileInput = null;
          }
        });
    });
    fileInput.click();
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
      console.log(event)
    }
  }

  public tryOpen(event, id) {
    if (event.target.outerText !== 'download' && event.target.outerText !== 'delete') {

    }
  }
}
