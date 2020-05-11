import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfile } from 'src/app/profile/userProfile.model';
import { CommunityService } from './community.service';
import { Subscription } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit,OnDestroy {

  isLoading = false;
  usersOfCommunity:UserProfile[];
  communitySubscription:Subscription;
  constructor(private communityService:CommunityService) { }
  ngOnInit() {}

  ionViewWillEnter(){
    this.communitySubscription = this.communityService.fetchUsers().subscribe(listOfUsers=>{
      this.usersOfCommunity = listOfUsers;
      console.log(this.usersOfCommunity);
    })
  }
  ngOnDestroy(){
    if(this.communitySubscription)
      this.communitySubscription.unsubscribe();
  }
  onSeeConversation(userId:string,slidingUser:IonItemSliding){

  }
  onSendMessage(userId:string,slidingUser:IonItemSliding){

  }
}
