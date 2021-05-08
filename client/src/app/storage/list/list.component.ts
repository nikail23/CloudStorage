import { PathHelper } from './pathHelper';
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

  private pathHelper: PathHelper;

  constructor
  (
    private storageService: StorageService,
    private subscriptionService: SubscriptionsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.progressHelper = new ProgressHelper();
    this.pathHelper = new PathHelper();
    this.loadStorageList();
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  public loadStorageList(): void {
    const last = this.pathHelper.getLast();
    if (last !== null) {
      const subscription = this.storageService.getChildren(last.childrenId).subscribe((storageList) => {
        this.storageList = storageList;
      });
      this.subscriptionService.push(subscription);
    } else {
      const subscription = this.storageService.getAll().subscribe((storageList) => {
        this.storageList = storageList;
      });
      this.subscriptionService.push(subscription);
    }
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
      this.storageService.get(id).subscribe((storageElement: StorageElement) => {
        const dialog = this.dialog.open(DeleteComponent, {
          data: storageElement
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
      });
    }
  }

  public download(event, id: number): void {
    if (event.target.outerText === 'download') {
      this.storageService.downloadFile(id, this.storageList[id].name);
      this.loadStorageList();
    }
  }

  public openFolder(event, id: number): void {
    if (event.target.outerText !== 'download' && event.target.outerText !== 'delete') {
      this.storageService.get(id).subscribe((element) => {

        if (element.type === StorageElementType.Folder) {
          this.pathHelper.push(element);

          this.loadStorageList();
        }
      });
    }
  }
}
