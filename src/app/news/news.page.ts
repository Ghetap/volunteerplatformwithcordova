import { Component, OnInit } from '@angular/core';
import { FcmService } from '../shared/fcm.service';
import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { NewsService } from './news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  constructor(
    public fcmService:FcmService,
    private newsService:NewsService,
    public toastCtrl:ToastController) { 
      this.notificationSetup();
    }

  ionViewDidLoad(){}
  ngOnInit() {}
  private notificationSetup(){
    this.fcmService.getToken();
    this.fcmService.listenToNotifications().subscribe(
      (msg)=>{
        this.makeToast(msg.body);
        //TODO save notication
        //this.newsService.addNotificationToUser(msg.body);
      }
    )
    this.fcmService.receiveMessage().subscribe((msg)=>{
      const body:any = (msg as any).body;
      this.makeToast(body);
      //TODO save notication
    })
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
