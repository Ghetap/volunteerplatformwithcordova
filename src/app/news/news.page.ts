import { Component, OnInit } from '@angular/core';
import { FcmService } from '../shared/fcm.service';
import { ToastController } from '@ionic/angular';
import { NewsService } from './news.service';
import { Notification } from './notifications/notification.model';


@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  prevLenght:number;
  currentLenght:number;
  numberNewNotifications:number;
  notifications:Notification[];
  constructor(
    public fcmService:FcmService,
    public newsService:NewsService,
    public toastCtrl:ToastController) { 
      this.notificationSetup();
    }

  ionViewDidLoad(){}
  ngOnInit() {
    this.newsService.notifications.subscribe(notificationsList=>{
      this.prevLenght = this.notifications.length;
      this.notifications = notificationsList;
      this.currentLenght = this.notifications.length;
      this.numberNewNotifications = this.currentLenght-this.prevLenght;
      console.log(this.numberNewNotifications);
    })
  }
  private notificationSetup(){
    this.fcmService.getToken();
    this.fcmService.listenToNotifications().subscribe(
      (msg)=>{
        console.log(msg.body)
        this.makeToast(msg.body);
        let idAnnouncement = msg.title.split(" ").splice(-1);
        this.newsService.addNotificationToUser(msg.body,msg.title,idAnnouncement).subscribe();
      }
    )
    this.fcmService.receiveMessage().subscribe(
      (messaging: any) => {
        messaging.onMessageCallback = (payload: any) => {
          console.log(payload);
          this.makeToast(payload.notification.body);
          let idAnnouncement = (payload.notification.title.split(" ").splice(-1))[0];
          console.log(idAnnouncement);
          this.newsService.addNotificationToUser(payload.notification.body,payload.notification.title,idAnnouncement).subscribe();
        };
      });
  }
  private async makeToast(message){
    const toast = await this.toastCtrl.create({
      message,
      duration:3000,
      position:'top', 
      buttons:['Dismiss']
    });
    toast.present();
  }
}
