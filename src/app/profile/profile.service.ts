import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { take, map, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../auth/user.model';
import { UserProfile } from './userProfile.model';
import { of, BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _userProfile = new BehaviorSubject<UserProfile>(null);
  private _url = new BehaviorSubject<string>(null);
  email:string;
  userId:string;
  constructor(private authService:AuthService,private firestore:AngularFirestore,
    private astorage:AngularFireStorage) { }

  get userProfile(){
    return this._userProfile.asObservable();
  }
  get url(){
    return this._url.asObservable();
  }
  getUserDetails(){
    let firstname;
    let lastname;
    let imageUrl;
    let description;
    return this.authService.userId.pipe(
      switchMap((userId)=>{
        this.userId = userId;
        var docRef = this.firestore.collection('users').doc(userId);
        return docRef.get()
      }),
      take(1),
      map(userdoc=>{
        var userData = userdoc.data();
          this.email = userData.email ? userData.email: '';
          firstname = userData.firstname ? userData.firstname: '';
          lastname = userData.lastname ? userData.lastname:'';
          imageUrl = userData.imageUrl ? userData.imageUrl:'';
          description = userData.description ? userData.description:'';
        return new UserProfile(this.userId,this.email,firstname,lastname,imageUrl,description);
      }),
      tap((user)=>this._userProfile.next(user))
    )
  }
  updateUserProfile(firstname?:string , lastname?:string, description?:string, url?:string){
    var userIdCopy;
    var user;
    return this.authService.userId.pipe(
      take(1),
      map(userId=>{
        if(!userId)
        throw new Error('User not found');
        userIdCopy = userId;
        return userId;
      }),
      // switchMap((userId)=>{
      //   var docRef = this.firestore.collection('users').doc(userId);
      //   return docRef.get();
      // }),
      // take(1),
      // switchMap(userdoc=>{
      //   var data = userdoc.data();
      //   return of(data);
      // }),
      switchMap(()=>{
        user = new UserProfile(this.userId,this.email,firstname?firstname:'',
        lastname?lastname:'',url?url:'',description?description:'');
        return of(user)
      }),
      switchMap((user)=>{
        return this.firestore.collection('users').doc(userIdCopy).update({
          firstname: user.firstname,
          lastname: user.lastname,
          description: user.description,
          imageUrl: user.imageUrl,
        });
      }),
      tap(()=>{return this._userProfile.next(user)})
    )
  }

}
