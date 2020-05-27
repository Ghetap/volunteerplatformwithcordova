import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserProfile } from './profile/userProfile.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy{
  @Input() userProfile:UserProfile;
  userProfileSub:Subscription;
  token;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService:AuthService,
    private router:Router) {
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
 

  ngOnInit(){
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth=>{
        if(!isAuth && this.previousAuthState !== isAuth){
          this.router.navigateByUrl('/auth');
        }
        this.previousAuthState = isAuth;
      }
    )
  }
  ngOnDestroy(){
    if(this.authService)
      this.authSub.unsubscribe();
    if(this.userProfileSub)
      this.userProfileSub.unsubscribe();
  }
  onLogout() {
    this.authService.logout();
  }
}
