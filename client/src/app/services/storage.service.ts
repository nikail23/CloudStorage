import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StorageElement, StorageElementType } from './storage.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storageList: Array<StorageElement>;

  constructor(private http: HttpClient) {
    this.storageList = [
      new StorageElement(0, 'file1.exe', './root/file1.exe', StorageElementType.File, new Date(), 1024),
      new StorageElement(1, 'file2.exe', './root/file2.exe', StorageElementType.File, new Date(), 766),
      new StorageElement(2, 'folder1', './root/file1.exe', StorageElementType.Folder, new Date()),
    ];
  }

  public getAll(): Observable<StorageElement[]> {
    return of(this.storageList);
  }

  public sendFile(file: File): Observable<HttpEvent<Object>> {
    const uploadData = new FormData();
    uploadData.append('UploadFile', file, file.name);
    return this.http.post('http://127.0.0.1:3000/upload', uploadData, {
      reportProgress: true,
      observe: 'events',
    });
  }

}
