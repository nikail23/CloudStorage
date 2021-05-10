import { UserService } from './../../services/user.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  @Output() public loginEvent = new EventEmitter();

  public isLogin = true;

  public showSpinner: boolean;

  public login: string;
  public password: string;
  public repeatPassword: string;
  public errorMessage: string

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  public logIn(login: string, password: string) {
    this.userService.logIn(login, password).subscribe((result) => {
      if (result) {
        this.loginEvent.emit(result['login']);
      } else {
        this.errorMessage = "User with such values dont exists!";
      }
    });
  }

  public register(login: string, password: string, repeatPassword: string) {
    if (password === repeatPassword) {
      this.userService.register(login, password).subscribe((result) => {
        if (result === true) {
          this.isLogin = true;
        } else {
          this.errorMessage = "Something went wrong!";
        }
      });
    } else {
      this.errorMessage = "Passwords are different!";
    }
  }

}
