import { SubscriptionsService } from './../../services/subscriptions.service';
import { UserService } from './../../services/user.service';
import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Output() sidenavButtonClicked = new EventEmitter();

  public userName: string;

  constructor(
    private userService: UserService
  ) {
    this.userName = this.userService.getUserName();
  }

  ngOnInit(): void {

  }
}
