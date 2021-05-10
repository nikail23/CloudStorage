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

  public get(id: number, userName: string): Observable<StorageElement> {
    const params = new HttpParams()
    .set('id', id.toString())
    .set('userName', userName);
    return this.http.get('http://127.0.0.1:3000/get', {params}).pipe(
      map((storageElement: any) => {

        let type: StorageElementType;

          switch (storageElement.type) {
            case 0: type = StorageElementType.File; break;
            case 1: type = StorageElementType.Folder; break;
          }

          let size: string;

          if (storageElement.size) {
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

  public getAll(userName: string): Observable<StorageElement[]> {
    const params = new HttpParams()
    .set('userName', userName);
    return this.http.get('http://127.0.0.1:3000/storage', {params}).pipe(
      map((storageList: any[]) => {
        const newList: StorageElement[] = [];
        storageList.forEach((storageElement) => {
          let type: StorageElementType;

          switch (storageElement.type) {
            case 0: type = StorageElementType.File; break;
            case 1: type = StorageElementType.Folder; break;
          }

          let size: string = '';

          if (storageElement.size) {
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

  public getChildren(id: number, userName: string) {
    const params = new HttpParams()
    .set('id', id.toString())
    .set('userName', userName);
    return this.http.get('http://127.0.0.1:3000/children', {params}).pipe(
      map((storageList: any[]) => {
        const newList: StorageElement[] = [];
        storageList.forEach((storageElement) => {
          let type: StorageElementType;

          switch (storageElement.type) {
            case 0: type = StorageElementType.File; break;
            case 1: type = StorageElementType.Folder; break;
          }

          let size: string;

          if (storageElement.size) {
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

  public sendFile(file: File, path: number[], userName: string): Observable<HttpEvent<Object>> {
    const uploadData = new FormData();
    uploadData.append('UploadFile', file, file.name);
    uploadData.append('Path', JSON.stringify(path));
    uploadData.append('userName', JSON.stringify(userName));
    return this.http.post('http://127.0.0.1:3000/upload', uploadData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public downloadFile(id: number, fileName: string, userName: string): void {
    let downloadAncher = document.createElement("a");
    downloadAncher.style.display = "none";
    downloadAncher.href = `http://127.0.0.1:3000/download?id=${id}&userName=${userName}`;
    downloadAncher.download = fileName;
    downloadAncher.click();
    downloadAncher = null;
  }

  public deleteFile(id: number, userName: string): Observable<any> {
    const params = new HttpParams()
    .set('id', id.toString())
    .set('userName', userName);
    return this.http.delete('http://127.0.0.1:3000/delete', {params});
  }

  public createFolder(name: string, path: number[], userName: string): Observable<any> {
    const body = JSON.stringify({
      name,
      path,
      userName
    });
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post('http://127.0.0.1:3000/createFolder', body, httpOptions);
  }
}
