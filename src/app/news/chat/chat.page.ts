import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { ActivatedRoute,  } from '@angular/router';
import { ChatService } from './chat.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit,OnDestroy{

  bool;
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
    private chatService:ChatService
  ) {
  } 

  ngOnInit() {
    this.route.paramMap.subscribe(
      paramMap=>{
        if(!paramMap.has('receiverEmail') || !paramMap.has('senderEmail') || !paramMap.has('bool')){
            this.navCtrl.navigateBack('/news/tabs/announcement');
            return;
        }
        this.bool = paramMap.get('bool')
        console.log(this.bool);
        if(this.bool === true){
          this.receiverEmail = paramMap.get('senderEmail');
          this.senderEmail = paramMap.get('receiverEmail');
        }else{
          this.receiverEmail = paramMap.get('receiverEmail');
          this.senderEmail = paramMap.get('senderEmail');
        }
        this.chat$ = this.chatService.getChat(this.receiverEmail,this.senderEmail);
      }
    )
      //folosim acelasi chat de comunicare
  }
  sendMessage(){
    let docId = this.receiverEmail+'+'+this.senderEmail;
    if(this.bool === true){
        docId = this.senderEmail+'+'+this.receiverEmail;
    }
    else
      this.chatService.sendMessage(docId,this.message,this.senderEmail);
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
