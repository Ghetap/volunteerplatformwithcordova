import { Component, OnInit } from '@angular/core';
import { Notification } from './notification.model';
import { FcmService } from 'src/app/shared/fcm.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-notificaions',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications;
  isLoading=false;
  constructor(private newsService:NewsService) { }

  ngOnInit() {
    // this.newsService.notifications.subscribe(notifList=>{
    //   this.notifications = notifList;
    //   console.log("Hello from notifications");
    //   console.log(notifList);
    // })
  }
  ionViewWillEnter(){
    // this.isLoading = true;
    // this.newsService.getUsersNotifications().subscribe(()=>{
    //   this.isLoading = false;
    // })
  }
}
