import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, Platform, ToastController} from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import {  AngularFirestore } from '@angular/fire/firestore';
import { AuthService, AuthResponseData } from './auth.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import {ELocalNotificationTriggerUnit} from '@ionic-native/local-notifications/ngx';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})

export class AuthPage implements OnInit,OnDestroy{
  isLoading = false;
  isLogin = true;
  isLoginAsStudent = true;
  yesSub:Subscription;
  noSub:Subscription
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private firestore:AngularFirestore,
    private toastController:ToastController,
    private platform:Platform,
    private localNotifications:LocalNotifications

  ) {}

  ngOnInit() {}
  ngOnDestroy(){
    if(this.yesSub)
      this.yesSub.unsubscribe();
    if(this.noSub)
      this.noSub.unsubscribe();
  }
  authenticate(
    email: string,
    password: string,
    ) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Authenticating...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
          authObs.subscribe(
            resData => {
              console.log(resData);
              this.isLoading = false;
              loadingEl.dismiss();
              
              this.router.navigateByUrl('/news/tabs/announcement');
            },
            errRes => {
              loadingEl.dismiss();
              const code = errRes.error.error.message;
              let message = 'Could not sign you in, please try again.';
              if (code === 'EMAIL_NOT_FOUND') {
                message = 'The email address is already in use by another account.';
              } else if (code === 'INVALID_PASSWORD') {
                message = 'The password is invalid or the user does not have a password.';
              } else if (code === 'USER_DISABLED') {
                message = 'The user account has been disabled by an administrator.';
              }
              this.showAlert(message);
            }
          );

        } else {
          authObs = this.authService.signup(email, password);
          authObs.subscribe(
            resData => {
              console.log(resData);
              this.firestore.doc(`users/${resData.localId}`)
              .set({
                email:email,
                password:password,

              })
              this.isLoading = false;
              loadingEl.dismiss();
              this.platform.ready().then(()=>{
                this.noSub = this.localNotifications.on('no')
                .subscribe(()=>this.router.navigateByUrl('/news/tabs/announcement'));
                this.yesSub = this.localNotifications.on('yes')
                .subscribe(()=>this.router.navigateByUrl('/profile'));
              })
            },
            errRes => {
              loadingEl.dismiss();
              const code = errRes.error.error.message;
              let message = 'Could not sign you up, please try again.';
              if (code === 'EMAIL_EXISTS') {
                message = 'The email address is already in use by another account.';
              } else if (code === 'OPERATION_NOT_ALLOWED') {
                message = 'Password sign-in is disabled for this project.';
              } else if (code === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                message = 'We have blocked all requests from this device due to unusual activity. Try again later..';
              }
              this.showAlert(message);
            }
          );
        }
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const cpassword = form.value.confirmpassword
    if(password !== cpassword && !this.isLogin){
      this.showAlert('Passwords are not equal !');
    }else{
      this.authenticate(email, password);
      form.reset();
    }
   
  }
  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  scheduleNotification(){
    this.localNotifications.schedule({
      id:1,
      title:'Do you want to set your user profile first ?',
      actions:[ 
          { id: 'yes', title: 'Yes' },
          { id: 'no',  title: 'No' }],
      trigger: {in:1, unit:ELocalNotificationTriggerUnit.SECOND},
      foreground:true
    })
  }
}
