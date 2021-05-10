import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public isLogin = true;

  public showSpinner: boolean;

  public login: string;
  public password: string;
  public repeatPassword: string;

  constructor() { }

  ngOnInit(): void {
  }

}
