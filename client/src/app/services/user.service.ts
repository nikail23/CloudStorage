import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
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
}
