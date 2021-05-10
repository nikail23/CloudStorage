import { SubscriptionsService } from './../../services/subscriptions.service';
import { UserService } from './../../services/user.service';
import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Output() sidenavButtonClicked = new EventEmitter();
  @Output() logOutEvent = new EventEmitter();

  @Input() userName: string;
  @Input() isAuth: boolean;

  constructor() {
  }

  ngOnInit(): void {

  }

  public logOut() {
    this.logOutEvent.emit();
  }
}
