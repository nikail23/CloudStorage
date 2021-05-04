import { SubscriptionsService } from './../../services/subscriptions.service';
import { UserService } from './../../services/user.service';
import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() sidenavButtonClicked = new EventEmitter();

  public userName: string;

  constructor(
    private userService: UserService,
    private subscriptionsService: SubscriptionsService
  ) {
    const subscription = this.userService.getUserName().subscribe((userName) => {
      this.userName = userName;
    });
    this.subscriptionsService.push(subscription);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptionsService.unsubscribeAll();
  }
}
