import { Component, OnInit } from '@angular/core';
import { FcmService } from '../shared/fcm.service';
import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  constructor(
    public fcmService:FcmService,
    public toastCtrl:ToastController) { }

  ngOnInit() {
    this.fcmService.getToken();
    this.fcmService.listenToNotifications().pipe(
      tap(msg=>{
          this.makeToast(msg.body);
      })
    );
  }
  async makeToast(message){
    const toast = await this.toastCtrl.create({
      message,
      duration:3000,
      position:'top', 
      buttons:['Dismiss']
    });
    toast.present();
  }
}
