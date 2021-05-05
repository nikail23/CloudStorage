import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StorageElement, StorageElementType } from './storage.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storageList: Array<StorageElement>;

  constructor() {
    this.storageList = [
      new StorageElement('file1.exe', './root/file1.exe', StorageElementType.File, new Date(), 1024),
      new StorageElement('file2.exe', './root/file2.exe', StorageElementType.File, new Date(), 766),
      new StorageElement('folder1', './root/file1.exe', StorageElementType.Folder, new Date()),
    ];
  }

  public getAll(): Observable<StorageElement[]> {
    return of(this.storageList);
  }

}
