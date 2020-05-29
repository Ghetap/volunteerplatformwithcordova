import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class FcmService implements OnDestroy{
  messages$:Observable<any>;
  token;
  constructor(
    public firebaseNative:Firebase,
    public firestore:AngularFirestore,
    private platform :Platform,
    private afMessaging:AngularFireMessaging,
    private authService:AuthService) {
      // this.afMessaging.messaging.subscribe(
      //   (_messaging) => {
      //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      //   }
      //   )
    }
    
  async getToken(){
    let token;
    if(this.platform.is('cordova'))
    {
      if(this.platform.is('android')){
        token = await this.firebaseNative.getToken();
      }
      if(this.platform.is('ios')){
        token = await this.firebaseNative.getToken();
        await this.firebaseNative.grantPermission();
      }
      this.saveTokenToFirestore(token).subscribe();
    }else if(!this.platform.is('cordova')){
      this.afMessaging.requestToken.subscribe(token=>{
        token=token;
        this.saveTokenToFirestore(token).subscribe();
      })    
    }
  }
  private saveTokenToFirestore(token){
    if(!token) 
      return;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId)=>{
        return this.firestore.doc(`users/${userId}`).get()
      }),
      take(1),
      map((doc)=>{
        return doc.data().email;
      }),
      tap(email=>{
        const devicesRef =  this.firestore.collection('devices');
        devicesRef.doc(token).set({
          token,
          email
        })
      })
    );
  }

  listenToNotifications(){
    return this.firebaseNative.onNotificationOpen();
  }
  receiveMessage() {
    return this.afMessaging.messaging; 
  }
  ngOnDestroy(){}
}
