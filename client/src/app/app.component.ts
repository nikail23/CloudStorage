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

  isStarted = true;

  @ViewChild(ListComponent, {static: false})
  private listComponent: ListComponent;

  sidenavButtonClick() {
    this.listComponent.toggleSidenav();
  }

  public succesfullyLogin(userName) {
    this.isStarted = false;
    this.userName = userName;
  }

}
