import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CommunityService } from '../community.service';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit,OnDestroy {

  constructor(
    public firestore:AngularFirestore,
    private navCtrl:NavController,
    private route:ActivatedRoute,
    private profileService:ProfileService,
    private communityService:CommunityService
    ) 
    {
      this.communityService.messages.subscribe(mes=>{
        console.log(mes);
        this.messages = mes;
      })
    }

  receiverId;
  receiverEmail;
  senderEmail;
  message;
  messages;
  messageSubscription:Subscription;
  ngOnInit() {
    this.profileService.getUserDetails().subscribe
    this.route.paramMap.subscribe(
      paramMap=>{
        if(!paramMap.has('receiverId') || !paramMap.has('receiverEmail')){
            this.navCtrl.navigateBack('/news/tabs/announcement');
            return;
        }
        this.receiverId = paramMap.get('receiverId');
        this.receiverEmail = paramMap.get('receiverEmail');
        this.senderEmail = paramMap.get('senderEmail');
        console.log(this.receiverEmail);
      }
    )
  }
  sendMessage(){
    this.messageSubscription = this.communityService.
    saveConversation(this.receiverId,this.receiverEmail,this.message).subscribe();
    this.message="";
  }
  ionViewDidLoad(){
  }
  ngOnDestroy(){
    if(this.messageSubscription)
      this.messageSubscription.unsubscribe();
  }
}
