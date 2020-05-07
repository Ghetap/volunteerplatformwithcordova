import { Component, OnInit } from '@angular/core';
import { Notification } from './notification.model';

@Component({
  selector: 'app-notificaions',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  newNotifications:Notification[];
  seenNotifications:Notification[];
  constructor() { }

  ngOnInit() {
  }

}
