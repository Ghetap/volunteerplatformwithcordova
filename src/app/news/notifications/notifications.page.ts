import { Component, OnInit, OnDestroy } from '@angular/core';
import { Notification } from './notification.model';
import { NewsService } from '../news.service';
import { IonItemSliding, LoadingController } from '@ionic/angular';
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
  notificationSubscription:Subscription;
  isLoading=false;
  constructor(
    private newsService:NewsService,
    private router:Router,
    private loadingCtrl:LoadingController,
    private chatService:ChatService) { }

  ngOnInit() {
    this.isLoading = true;
   this.notificationSubscription = this.newsService.notifications.subscribe(notificationsList=>{
      this.loadedNotifications = notificationsList.sort((a,b)=>
      new Date(b.date).getTime() - new Date(a.date).getTime());
      this.isLoading = false;
    })
  }
  ionViewWillEnter(){
    this.isLoading = true;
    this.newsService.getUsersNotifications().subscribe(()=>{
      this.isLoading = false
    })
  }

  onAnswer(announcementId:string,notificationTitle:string,slidingNotification:IonItemSliding){
    slidingNotification.close();
    let senderEmail;
    let receiverEmail;
    this.chatService.getSenderEmail().subscribe(email=>{
        senderEmail=email
        const firstvariable = "From";
        const secondvariable = "for";
        receiverEmail = 
        notificationTitle.match(new RegExp(firstvariable + "(.*)" + secondvariable));
        this.router.navigate(['/','news','tabs','chat',announcementId,senderEmail,receiverEmail[1].trim()]);
    });
  }
  onDeleteNotification(id:string,title:string,
    text:string,seen:boolean,date:Date,announcementId:string,slidingNotification:IonItemSliding){
      slidingNotification.close();
      const data = {
        id,
        announcementId,
        title,
        text,
        seen,
        date
    }
    this.loadingCtrl.create({
      message:'Deleting notification...'
    }).then(loadingEl=>{
      loadingEl.present();
      this.newsService.deleteNotification(data).subscribe(()=>{
        loadingEl.dismiss();
      })
    })
  }
  ngOnDestroy(){
    if(this.notificationSubscription)
      this.notificationSubscription.unsubscribe();
  }
  ionViewDidLeave(){
    this.newsService.resetNumberOfNotifications();
    this.newsService.markNotificationsAsSeen(this.loadedNotifications).subscribe();
  }
}
