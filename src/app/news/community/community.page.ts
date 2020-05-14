import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfile } from 'src/app/profile/userProfile.model';
import { CommunityService } from './community.service';
import { Subscription } from 'rxjs';
import { IonItemSliding, NavController, LoadingController } from '@ionic/angular';
import { ChatPage } from './chat/chat.page';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit,OnDestroy {

  isLoading = false;
  usersOfCommunity:UserProfile[];
  communitySubscription:Subscription;
  constructor(
    private communityService:CommunityService,
    private loadingCtrl:LoadingController,
    private authService:AuthService,
    private router:Router) { }
  ngOnInit() {}

  ionViewWillEnter(){
    this.communitySubscription = this.communityService.fetchUsers().subscribe(listOfUsers=>{
      this.usersOfCommunity = listOfUsers;
    })
  }
  ngOnDestroy(){
    if(this.communitySubscription)
      this.communitySubscription.unsubscribe();
  }
  onSendMessage(userId:string,receiverEmail:string, slidingUser:IonItemSliding){
    slidingUser.close();
    this.loadingCtrl.create({
      message:'Opening Chat...'
    }).then(loadingEl=>{
      loadingEl.present();
        let senderEmail;
        this.communityService.getSenderEmail().subscribe((email)=>{
          senderEmail=email
          this.router.navigate(['/news/tabs/community/chat/'+userId+'/'+receiverEmail+'/'+senderEmail]);
        })
        loadingEl.dismiss();
      });
  }
}
