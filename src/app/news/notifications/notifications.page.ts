import { Component, OnInit, OnDestroy } from '@angular/core';
import { Notification } from './notification.model';
import { NewsService } from '../news.service';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ChatService } from '../chat/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificaions',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit,OnDestroy {

  loadedNotifications:Notification[];
  seenNotifications:Notification[];
  notificationSubscription:Subscription;
  isLoading=false;
  constructor(
    private newsService:NewsService,
    private router:Router,
    private chatService:ChatService) { }

  ngOnInit() {
   this.notificationSubscription= this.newsService.notifications.subscribe(notificationsList=>{
      this.loadedNotifications = notificationsList;
      this.seenNotifications = notificationsList;
    })
  }
  ionViewWillEnter(){
    this.isLoading = true;
    this.newsService.getUsersNotifications().subscribe(()=>{
      this.isLoading = false;
    })
  }

  onAnswer(announcementId:string,notificationTitle:string,slidingNotification:IonItemSliding){
    slidingNotification.close();
    let senderEmail;
    let receiverEmail;
    this.chatService.getSenderEmail().subscribe(email=>{
        senderEmail=email
        receiverEmail = notificationTitle.match(new RegExp('from' + '\\s(\\w+)'))[1];
        console.log(receiverEmail);
        this.router.navigate(['/','news','tabs','chat',announcementId,senderEmail,receiverEmail]);
    });
  }
  onDeleteNotification(announcementId:string,slidingAnnouncement){

  }
  ngOnDestroy(){
    if(this.notificationSubscription)
      this.notificationSubscription.unsubscribe();
  }
}
