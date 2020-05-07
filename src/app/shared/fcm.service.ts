import { Injectable, OnDestroy } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import {AngularFirestore} from 'angularfire2/firestore';
import { Platform } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FcmService implements OnDestroy{

  private getIdSub:Subscription;
  constructor(
    private firebase:Firebase, 
    private afs:AngularFirestore, 
    private platform:Platform,
    private authService:AuthService) { }

  ngOnDestroy(){
    if(this.getIdSub)
      this.getIdSub.unsubscribe();
  }
  async getToken(){
    let token;
    if(this.platform.is('android')){
      token = await this.firebase.getToken();
    }
    this.saveToken(token);
  }
  private saveToken(token) {
    if (!token) return;
    var id;
    const devicesRef = this.afs.collection('devices');
    this.getIdSub = this.authService.userId.subscribe(userId=>{id = userId})
    const data = {
      token,
      userId: id
    };
    return devicesRef.doc(token).set(data);
  }
  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}
