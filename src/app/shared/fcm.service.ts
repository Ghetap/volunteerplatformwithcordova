import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToastController } from '@ionic/angular';
import { tap, take, switchMap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class FcmService implements OnDestroy{
  currentMessage = new BehaviorSubject(null);
  token;
  constructor(
    public firebaseNative:Firebase,
    public firestore:AngularFirestore,
    private platform :Platform,
    private afMessaging:AngularFireMessaging,
    private functions:AngularFireFunctions,
    private authService:AuthService,
    private toastController:ToastController) {
      this.afMessaging.messaging.subscribe(
        (_messaging) => {
          _messaging.onMessage = _messaging.onMessage.bind(_messaging);
          _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        })
    }
    

  async getToken(){
    let token;
    if(this.platform.is('android')){
      token = await this.firebaseNative.getToken();
    }
    if(this.platform.is('ios')){
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }
    if(!this.platform.is('cordova')){
      //TODO
    }
    return this.saveTokenToFirestore(token);
  }
  private saveTokenToFirestore(token){
    if(!token) return;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId)=>{
        return this.firestore.doc(`users/${userId}`)
        .get()
      }),
      take(1),
      map((doc)=>{
        return doc.data().email;
      }),
      tap(email=>{
        this.firestore.doc(`devices/${email}`).set({
          token:token,
          email:email
        })
      })
    );
  }

  listenToNotifications(){
    return this.firebaseNative.onNotificationOpen()
  }
  // async makeToast(message){
  //   const toast = await this.toastController.create({
  //     message,
  //     duration:3000,
  //     position:'top', 
  //     buttons:['Dismiss']
  //   });
  //   toast.present();
  // }

  // requestPermission() {
  //  return this.afMessaging.requestToken.pipe(
  //    tap(token=>{
  //      this.token=token
  //     })
  //  )
  // }

  // receiveMessage() {
  //   return this.afMessaging.messages.pipe(
  //     take(1),
  //     tap(payload=>{
  //       console.log(payload);
  //       this.currentMessage.next(payload);
  //     })
  //   )
  // }
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
