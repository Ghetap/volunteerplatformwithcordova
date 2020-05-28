import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { ActivatedRoute,  } from '@angular/router';
import { ChatService } from './chat.service';
import { Subscription, Observable } from 'rxjs';
import { Message } from './message.model';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit,OnDestroy{

  chatId;
  receiverEmail;
  senderEmail;
  message;
  chat$:Observable<any>;
  messageSubscription:Subscription;
  getMessageSubcritpion:Subscription;
  messages:Message[];
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
        if(!paramMap.has('chatId') || !paramMap.has('emailSender') || !paramMap.has('emailReceiver')){
            this.navCtrl.navigateBack('/news/tabs/announcement');
            return;
        }
        this.chatId = paramMap.get('chatId');
        console.log(this.chatId);
        this.receiverEmail = paramMap.get('emailReceiver');
        console.log(this.receiverEmail);
        this.senderEmail = paramMap.get('emailSender')
        this.chat$ = this.chatService.getChat(this.chatId).pipe(switchMap(data=>{
          return data.messages.filter(item=>item['receiverEmail'] === this.senderEmail 
          || item['receiverEmail'] === this.senderEmail && item['receiverEmail'] === this.receiverEmail 
          || item['receiverEmail'] === this.receiverEmail)}
        ));
      }
    )
  }
  sendMessage(){
   this.chatService.sendMessage(this.chatId,this.message,this.senderEmail,this.receiverEmail);
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
