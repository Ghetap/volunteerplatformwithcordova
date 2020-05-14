import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, OnChanges, AfterViewInit, AfterContentChecked } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommunityService } from '../community.service';
import { Subscription, Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { Message } from '../message.model';
import { switchMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { collection } from 'rxfire/firestore';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit,OnDestroy{

    senderId;
    receiverId;
    receiverEmail;
    senderEmail;
    message;
    chat$:Observable<any>;
    messageSubscription:Subscription;
    getMessageSubcritpion:Subscription;
    constructor(
      public firestore:AngularFirestore,
      private navCtrl:NavController,
      private route:ActivatedRoute,
      private authService:AuthService,
      private communityService:CommunityService
    ) {} 

  ngOnInit() {
    this.route.paramMap.subscribe(
      paramMap=>{
        if(!paramMap.has('receiverId') || !paramMap.has('receiverEmail') || !paramMap.has('senderEmail')){
            this.navCtrl.navigateBack('/news/tabs/announcement');
            return;
        }
        this.receiverId = paramMap.get('receiverId');
        console.log(this.receiverId);
        this.receiverEmail = paramMap.get('receiverEmail');
        console.log(this.receiverEmail);
        this.senderEmail = paramMap.get('senderEmail');
        console.log(this.senderEmail);
        this.authService.userId.subscribe(userId=>{this.senderId=userId})

        //this.getMessageSubcritpion = this.communityService.getConversationBetweenSenderReceiver(this.receiverId).subscribe();
      }
    )
      this.chat$ = this.communityService.getChat(this.senderId);

    // this.messageSubscription = this.communityService.messages.subscribe(mes=>{
    //   console.log(mes);
    //   this.messages.next(mes);  
    // })
  }
  sendMessage(){
    //let docId = Math.random().toString();
    let docId = this.senderId;
    this.communityService.sendMessage(docId,this.receiverId,this.receiverEmail,this.message);
    this.message="";
  }
  trackByCreated(i,msg){
    return msg.createdAt;
  }
  ngOnDestroy(){
    if(this.messageSubscription)
      this.messageSubscription.unsubscribe();
    if(this.getMessageSubcritpion)
      this.getMessageSubcritpion.unsubscribe();
  }
}
