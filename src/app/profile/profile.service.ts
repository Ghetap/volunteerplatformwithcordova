import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { take, map, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfile } from './userProfile.model';
import { of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _userProfile = new BehaviorSubject<UserProfile>(null);
  private _url = new BehaviorSubject<string>(null);
  email:string;
  userId:string;
  constructor(private authService:AuthService,private firestore:AngularFirestore) { }

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
    let profession;
    let where;
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
          profession = userData.profession ? userData.profession :'';
          where = userData.where ? userData.where : '';
        return new UserProfile(this.userId,this.email,firstname,lastname,profession,where,imageUrl,description);
      }),
      tap((user)=>this._userProfile.next(user))
    )
  }
  updateUserProfile(firstname:string , lastname:string, description:string, url:string,profession:string,where:string){
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
      switchMap(()=>{
        user = new UserProfile(this.userId,this.email,firstname,
        lastname,profession,where,url?url:'',description?description:'');
        return of(user)
      }),
      switchMap((user)=>{
        return this.firestore.collection('users').doc(userIdCopy).update({
          firstname: user.firstname,
          lastname: user.lastname,
          profession:user.profession,
          where:user.where,
          description: user.description,
          imageUrl: user.imageUrl,
        });
      }),
      tap(()=>{return this._userProfile.next(user)})
    )
  }

}
