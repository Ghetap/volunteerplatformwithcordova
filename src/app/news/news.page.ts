import { Component, OnInit } from '@angular/core';
import { FcmService } from '../shared/fcm.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  messageData;
  constructor(
    public fcmService:FcmService,
    public toastCtrl:ToastController) { 
      this.notificationSetup();
    }

  ionViewDidLoad(){}
  ngOnInit() {}
  private notificationSetup(){
    this.fcmService.getToken();
    this.fcmService.listenToNotifications().subscribe(
      (msg)=>{
        console.log(msg.body)
        this.makeToast(msg.body);
        //this.newsService.addNotificationToUser(msg.body);
      }
    )
    this.fcmService.receiveMessage().subscribe(
      (messaging: any) => {
        messaging.onMessageCallback = (payload: any) => {
          this.makeToast(payload.notification.body);
          console.log(payload);
        };
      });
    this.messageData = this.fcmService.currentMessage;
    console.log(this.messageData);
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
