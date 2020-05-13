import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
// import * as app from 'firebase';

// const _messaging = app.messaging();
// _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
// _messaging.onMessage = _messaging.onMessage.bind(_messaging);

@Injectable({
  providedIn: 'root'
})
export class FcmService implements OnDestroy{
  currentMessage = new BehaviorSubject(null);
  token;
  constructor(
    private afMessaging:AngularFireMessaging,
    private functions:AngularFireFunctions,
    private firestore:AngularFirestore,
    private authService:AuthService,
    private toastController:ToastController) {
      this.afMessaging.messaging.subscribe(
        (_messaging) => {
          _messaging.onMessage = _messaging.onMessage.bind(_messaging);
          _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        })
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

  requestPermission() {
   return this.afMessaging.requestToken.pipe(
     tap(token=>(this.token=token))
   )
  }
  saveToken(token){
    this.authService.userId.pipe(
      tap(userId=>{
        this.firestore.doc(`devices/${token}`).set({
          token:token,
          userId:userId
        })
      })
    ).subscribe();
  }
  receiveMessage() {
    this.afMessaging.messaging.subscribe(
      (_messaging: any) => {
        _messaging._next = (payload: any) => {
            console.log(payload)
            this.currentMessage.next(payload);
        };
    })
  }
  sub(topic){
    this.functions
    .httpsCallable('subscribeToTopic')({topic,token:this.token})
    .pipe(tap(_=>this.makeToast(`subscribed to ${topic}`)))
    .subscribe();

    this.saveToken(this.token);
  }
  unsub(topic){
    this.functions
    .httpsCallable('unsubscribeFromTopic')({topic,token:this.token})
    .pipe(tap(_=>this.makeToast(`unsubscribed from ${topic}`)))
    .subscribe();
  }
  ngOnDestroy(){}
}
