import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userName: string;

  constructor(private http: HttpClient) {
    this.userName = '';
  }

  public logIn(login: string, password: string): Observable<string> {
    const params = new HttpParams()
    .set('login', login)
    .set('password', password);
    return this.http.get<string>('http://127.0.0.1:3000/login', {params});
  }

  public register(login: string, password: string): Observable<boolean> {
    const params = new HttpParams()
    .set('login', login)
    .set('password', password);
    return this.http.get<boolean>('http://127.0.0.1:3000/register', {params});
  }

  public getUserName(): string {
    return this.userName;
  }
}
