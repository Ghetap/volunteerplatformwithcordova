import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileService } from './profile/profile.service';
import { UserProfile } from './profile/userProfile.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy{
  userProfile:UserProfile;
  userProfileSub:Subscription;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService:AuthService,
    private router:Router,
    private profileService:ProfileService
  ) {
    this.initializeApp();
  }

  private authSub:Subscription;
  private previousAuthState = false;
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  onLogout() {
    this.authService.logout();
  }

  ngOnInit(){
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth=>{
        if(!isAuth && this.previousAuthState !== isAuth){
          this.router.navigateByUrl('/auth');
        }
        this.previousAuthState = isAuth;
        this.userProfileSub = this.profileService.getUserDetails().subscribe(user=>{
          this.userProfile = user;
        })
      }
    )
  }
  ionWillEnter(){
    this.userProfileSub = this.profileService.getUserDetails().subscribe(user=>{
      this.userProfile = user;
    })
  }
  ngOnDestroy(){
    if(this.authService)
      this.authSub.unsubscribe();
    if(this.userProfileSub)
      this.userProfileSub.unsubscribe();
  }
}
