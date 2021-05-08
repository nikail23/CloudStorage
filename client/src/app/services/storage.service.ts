import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageElement, StorageElementType } from './storage.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private http: HttpClient) {}

  public get(id: number): Observable<StorageElement> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get('http://127.0.0.1:3000/get', {params}).pipe(
      map((storageElement: any) => {

        let type: StorageElementType;

          switch (storageElement.type) {
            case 0: type = StorageElementType.File; break;
            case 1: type = StorageElementType.Folder; break;
          }

          let size: string;

          if (storageElement.size < 1024) {
            size = `${(storageElement.size).toFixed(2)} B`;
          }

          if (storageElement.size >= 1024) {
            size = `${(storageElement.size / 1024).toFixed(2)} kB`;
          }

          if (storageElement.size > 1024 * 1024 ) {
            size = `${(storageElement.size / (1024 * 1024)).toFixed(2)} mB`;
          }

          if (storageElement.size > 1024 * 1024 * 1024 ) {
            size = `${(storageElement.size / (1024 * 1024 * 1024)).toFixed(2)} gB`;
          }

        const newElement = new StorageElement(
          storageElement.id,
          storageElement.name,
          storageElement.path,
          type,
          storageElement.createdAt,
          storageElement.parentId,
          size,
          storageElement.children
        );

        return newElement;
      })
    );
  }

  public getAll(): Observable<StorageElement[]> {
    return this.http.get('http://127.0.0.1:3000/storage').pipe(
      map((storageList: any[]) => {
        const newList: StorageElement[] = [];
        storageList.forEach((storageElement) => {
          let type: StorageElementType;

          switch (storageElement.type) {
            case 0: type = StorageElementType.File; break;
            case 1: type = StorageElementType.Folder; break;
          }

          let size: string;

          if (storageElement.size < 1024) {
            size = `${(storageElement.size).toFixed(2)} B`;
          }

          if (storageElement.size >= 1024) {
            size = `${(storageElement.size / 1024).toFixed(2)} kB`;
          }

          if (storageElement.size > 1024 * 1024 ) {
            size = `${(storageElement.size / (1024 * 1024)).toFixed(2)} mB`;
          }

          if (storageElement.size > 1024 * 1024 * 1024 ) {
            size = `${(storageElement.size / (1024 * 1024 * 1024)).toFixed(2)} gB`;
          }

          newList.push(
            new StorageElement(
              storageElement.id,
              storageElement.name,
              storageElement.path,
              type,
              storageElement.createdAt,
              storageElement.parentId,
              size,
              storageElement.children
            )
          );
        });
        return newList;
      })
    );
  }

  public sendFile(file: File): Observable<HttpEvent<Object>> {
    const uploadData = new FormData();
    uploadData.append('UploadFile', file, file.name);
    return this.http.post('http://127.0.0.1:3000/upload', uploadData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public downloadFile(id: number, fileName: string): void {
    let downloadAncher = document.createElement("a");
    downloadAncher.style.display = "none";
    downloadAncher.href = `http://127.0.0.1:3000/download?id=${id}`;
    downloadAncher.download = fileName;
    downloadAncher.click();
    downloadAncher = null;
  }

  public deleteFile(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete('http://127.0.0.1:3000/delete', {params});
  }

  public createFolder(name: string): Observable<any> {
    const body = JSON.stringify({
      name
    });
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post('http://127.0.0.1:3000/createFolder', body, httpOptions);
  }
}
