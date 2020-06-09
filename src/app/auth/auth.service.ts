import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { Storage } from '@ionic/storage';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

export interface SendEmailVerification{
  email:string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;
  constructor(
    private http: HttpClient,
    private storage:Storage,
    private firestore:AngularFirestore,
    private authfirestore:AngularFireAuth) {}

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }


  autoLogin(){
    return from(this.storage.get('authData'))
    .pipe(map(storedData=>{
      if(!storedData){
        return null;
      }
      const parsedData = 
      JSON.parse(storedData) as {
        token:string;
        tokenExpirationDate:string;
        userId:string;
        email:string;
       };
       const expirationTime = new Date(parsedData.tokenExpirationDate);
       if(expirationTime <= new Date()){
         return null;
       }
       const user = new User(
         parsedData.userId,
         parsedData.email,
         parsedData.token,
         expirationTime
       );
       return user;
    }),tap(user=>{
      if(user){
        this._user.next(user);
        this.autoLogout(user.tokenDuration);
      }
    }),
    map(user=>{
     return !! user;
    }));
   }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
          environment.firebaseApiKey
        }`,
        { email: email, password: password, returnSecureToken: true }
      ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
          environment.firebaseApiKey
        }`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    this.storage.remove('authData');
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    this.storage.set('authData', data);
  }
  deleteAccount(){
    return this.token.pipe(
      take(1), 
      switchMap(token=>{
        console.log(token);
        return this.http
        .post(
          `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${
            environment.firebaseApiKey
          }`,
          { "idToken": token }
        )
      })
    )
  }
  deleteUser(){
    return this.userId.pipe(
      take(1),
      map(userId=>{
        return this.firestore.collection('users').doc(userId).delete();
      })
    )
  }
  resetPassword(email:string): Promise<void> {
    return this.authfirestore.auth.sendPasswordResetEmail(email);
  }

  verifyEmail(){
    return this.token.pipe(
      take(1), 
      switchMap(token=>{
        console.log(token);
        return this.http
        .post<SendEmailVerification>(
          `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${
            environment.firebaseApiKey
          }`,
          {"requestType":"VERIFY_EMAIL","idToken":token}
        )
      })
    )
  }
}
