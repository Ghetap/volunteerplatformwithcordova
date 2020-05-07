import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { take, map, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../auth/user.model';
import { UserProfile } from './userProfile.model';
import { of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _userProfile = new BehaviorSubject<UserProfile>(null);

  constructor(private authService:AuthService,private firestore:AngularFirestore) { }

  get userProfile(){
    return this._userProfile.asObservable();
  }
  getUserDetails(userId){
    let email;
    return this.authService.userId.pipe(
      switchMap((userId)=>{
        var docRef = this.firestore.collection('users').doc(userId);
        return docRef.get()
      }),
      take(1),
      map(userdoc=>{
        var userData = userdoc.data();
        console.log(userData);
        if(userData.email)
          email = userData.email;
        return new UserProfile(userId,email);
      })
    )
  }
  updateUserProfile(firstname?:string , lastname?:string, descripion?:string, url?:string){
    var userIdCopy;
    return this.authService.userId.pipe(
      take(1),
      map(userId=>{
        if(!userId)
        throw new Error('User not found');
        userIdCopy = userId;
        return userId;
      }),
      switchMap((userId)=>{
        var docRef = this.firestore.collection('users').doc(userId);
        return docRef.get();
      }),
      take(1),
      switchMap(userdoc=>{
        var data = userdoc.data();
        return of(data);
      }),
      take(1),
      map((userData)=>{
        this.firestore.collection('users').doc(userIdCopy).update({
          firstname: firstname ? firstname : userData.firstname ? userData.firstname : '',
          lastname : lastname ? lastname : userData.lastname ? userData.lastname : '',
          descripion: descripion ? descripion : userData.description ? userData.descripion : '',
          imageUrl : url ? url: userData.imageUrl ? userData.imageUrl : '',
        });
      })
    )
  }
}
