import { Component, OnInit, OnDestroy } from '@angular/core';
import { FcmService } from '../shared/fcm.service';
import { ToastController } from '@ionic/angular';
import { NewsService } from './news.service';
import { Observable, Subscription, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit,OnDestroy {

  numberNewNotifications:Observable<number>;
  numberOfNotifSubcription:Subscription;
  getNotificationsSubcription:Subscription;
  contor:number=0;

  constructor(
    public fcmService:FcmService,
    public newsService:NewsService,
    public authService:AuthService,
    public toastCtrl:ToastController) { 
      this.notificationSetup();
    }

  ionViewDidLoad(){}

  ngOnInit() {
    this.numberOfNotifSubcription = this.newsService.numberOfNotifications.subscribe(nr=>{
      this.contor = nr;
      this.numberNewNotifications = of(nr);
    })
  }
  ngOnDestroy(){
    if(this.numberOfNotifSubcription)
      this.numberOfNotifSubcription.unsubscribe();
    if(this.getNotificationsSubcription)
      this.getNotificationsSubcription.unsubscribe();
  }
  ionViewWillEnter(){
    this.newsService.nrOfNotification().subscribe();
  }
  private notificationSetup(){
    this.fcmService.getToken();
    this.fcmService.listenToNotifications().subscribe(
      (msg)=>{
        this.makeToast(msg.body);
        this.contor++;
        this.numberNewNotifications = of(this.contor);
      }
    )
    this.fcmService.receiveMessage().subscribe(
      (messaging: any) => {
        messaging.onMessageCallback = (payload: any) => {
          //let idAnnouncement = (payload.notification.title.split(" ").splice(-1))[0];
          this.makeToast(payload.notification.body);
          this.contor++;
          this.numberNewNotifications = of(this.contor);
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
  ionViewDidLeave(){
    this.contor = 0;
  }
}
