import { delay } from 'rxjs/operators';
import { DeleteComponent } from './delete/delete.component';
import { ProgressHelper } from './progressHelper';
import { StorageElement, StorageElementType } from './../../services/storage.model';
import { SubscriptionsService } from './../../services/subscriptions.service';
import { StorageService } from './../../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpEventType, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

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

  public isFolderCreating = false;

  constructor
  (
    private storageService: StorageService,
    private subscriptionService: SubscriptionsService,
    public dialog: MatDialog
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

  public createFolder(name) {
    this.storageService.createFolder(name).subscribe(() => {
      this.isFolderCreating = false;
      this.loadStorageList();
    });
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

  public delete(event, id: number) {
    if (event.target.outerText === 'delete') {
        const dialog = this.dialog.open(DeleteComponent, {
          data: this.storageList[id]
        });

        dialog.afterClosed().subscribe(result => {
          if (result) {
            this.storageService.deleteFile(id).pipe(
              delay(500)
            ).subscribe(() => {
              this.loadStorageList();
            });
          }
        });
    }
  }

  public download(event, id: number): void {
    if (event.target.outerText === 'download') {
      this.storageService.downloadFile(id, this.storageList[id].name);
      this.loadStorageList();
    }
  }

  public tryOpen(event, id: number): void {
    if (event.target.outerText !== 'download' && event.target.outerText !== 'delete') {

      this.loadStorageList();
    }
  }
}
