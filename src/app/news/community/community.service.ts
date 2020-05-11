import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from 'src/app/profile/userProfile.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  private _communityUsers = new BehaviorSubject<UserProfile[]>([]);
  
  get communityUsers(){
    return this.communityUsers.asObservable();
  }
  constructor(private firestore:AngularFirestore) { }

  fetchUsers (){
    console.log('fetchUsers');
    return this.firestore.collection('users').get()
    .pipe(map(resData=>{
      const users = [];
      resData.docs.map(doc=>{
        const usersDoc = doc.data();
        console.log(usersDoc);
        const userId = doc.id;
        users.push(
          new UserProfile(
            userId,
            usersDoc.email,
            usersDoc.firstname,
            usersDoc.lastname,
            usersDoc.imageUrl,
            usersDoc.description
          )
        )
      })
      return users;
    }),
    tap(users=>{
      this._communityUsers.next(users)
    })
    );
  }
}
