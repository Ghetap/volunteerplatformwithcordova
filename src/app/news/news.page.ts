import { Component, OnInit } from '@angular/core';
import { FcmService } from '../shared/fcm.service';
import { ToastController } from '@ionic/angular';
import { NewsService } from './news.service';
import { Notification } from './notifications/notification.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  numberNewNotifications:number=0;
  public notifications:Notification[];
  constructor(
    public fcmService:FcmService,
    public newsService:NewsService,
    public toastCtrl:ToastController) { 
      this.notificationSetup();
    }

  ionViewDidLoad(){}
  ngOnInit() {
    this.newsService.notifications.subscribe(notificationsList=>{
      this.notifications = notificationsList;
    })
  }
  ionViewWillEnter(){
  }
  private notificationSetup(){
    this.fcmService.getToken();
    this.fcmService.listenToNotifications().subscribe(
      (msg)=>{
        this.makeToast(msg.body);
        this.numberNewNotifications++;
      }
    )
    this.fcmService.receiveMessage().subscribe(
      (messaging: any) => {
        messaging.onMessageCallback = (payload: any) => {
          //let idAnnouncement = (payload.notification.title.split(" ").splice(-1))[0];
          this.makeToast(payload.notification.body);
          this.numberNewNotifications++;
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
