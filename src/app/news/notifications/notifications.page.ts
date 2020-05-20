import { Component, OnInit } from '@angular/core';
import { Notification } from './notification.model';
import { FcmService } from 'src/app/shared/fcm.service';

@Component({
  selector: 'app-notificaions',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  message;
  constructor(private fcmService:FcmService) { }

  ngOnInit() {
    this.fcmService.currentMessage.subscribe(mess=>this.message = mess);
  }
}
