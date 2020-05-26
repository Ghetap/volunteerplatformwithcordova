import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ToastController } from '@ionic/angular';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FcmService implements OnDestroy{
  currentMessage = new BehaviorSubject(null);
  messages$:Observable<any>;
  token;
  constructor(
    public firebaseNative:Firebase,
    public firestore:AngularFirestore,
    private platform :Platform,
    private afMessaging:AngularFireMessaging,
    private authService:AuthService,
    private toastController:ToastController) {
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
    console.log(token);
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
        console.log(email);
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
  async makeToast(message){
    const toast = await this.toastController.create({
      message,
      duration:3000,
      position:'top', 
      buttons:['Dismiss']
    });
    toast.present();
  }
  receiveMessage() {
    return this.afMessaging.messaging; 
  }
  // sub(topic){
  //   this.functions
  //   .httpsCallable('subscribeToTopic')({topic,token:this.token})
  //   .pipe(tap(_=>this.makeToast(`subscribed to ${topic}`)))
  //   .subscribe();
  // }
  // unsub(topic){
  //   this.functions
  //   .httpsCallable('unsubscribeFromTopic')({topic,token:this.token})
  //   .pipe(tap(_=>this.makeToast(`unsubscribed from ${topic}`)))
  //   .subscribe();
  // }
  ngOnDestroy(){}
}
