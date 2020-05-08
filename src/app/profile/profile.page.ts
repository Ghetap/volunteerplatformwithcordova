import { Component, OnInit, Input } from '@angular/core';
import { User } from '../auth/user.model';
import { AuthService } from '../auth/auth.service';
import { take, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from './userProfile.model';
import { ProfileService } from './profile.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userProfile:UserProfile;
  constructor(private profileService:ProfileService,
    private authService:AuthService,
    private alertCtrl:AlertController,
    private router:Router) {
  }
  ngOnInit() {
    let fetchedUserId:string;
    this.authService.userId.pipe(
      take(1),
      switchMap(userId=>{
        if(!userId){
          throw new Error('No user found !')
        }
        fetchedUserId = userId;
        return this.profileService.getUserDetails(userId);
      })
    ).subscribe(user=>{
      this.userProfile = user;
      console.log(this.userProfile);
    },error=>{
      this.alertCtrl.create({
        header:'An error occured',
        message:'Could not load profile details',
        buttons:[{
          text:'Okay',
          handler:()=>{
            this.router.navigate(['/news/tabs/announcement']);
          }
        }]
      })
      .then(alerEl=>alerEl.present())
  })
}
}
