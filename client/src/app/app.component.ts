import { Component, ViewChild } from '@angular/core';
import { ListComponent } from './storage/list/list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'client';
  userName = '';

  isAuth = true;

  @ViewChild(ListComponent, {static: false})
  private listComponent: ListComponent;

  sidenavButtonClick() {
    this.listComponent.toggleSidenav();
  }

  public logOut() {
    this.userName = '';
    this.isAuth = true;
  }

  public succesfullyLogin(userName) {
    this.isAuth = false;
    this.userName = userName;
  }

}
