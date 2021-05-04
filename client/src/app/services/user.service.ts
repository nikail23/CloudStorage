import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userName: string;

  constructor() {
    this.userName = 'nikail23';
  }

  public getUserName(): Observable<string> {
    return of(this.userName);
  }
}
