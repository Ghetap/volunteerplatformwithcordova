import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { UserProfile } from 'src/app/profile/userProfile.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  private _communityUsers = new BehaviorSubject<UserProfile[]>([]);
  private _messages = new BehaviorSubject<Message[]>([]);
  get communityUsers(){
    return this.communityUsers.asObservable();
  }
  get messages(){
    return this._messages.asObservable();
  }
  constructor(
    private firestore:AngularFirestore,
    private authService:AuthService) { }

  getSenderEmail(){
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId)=>{
        return this.firestore.doc(`users/${userId}`)
        .get()
      }),map((doc)=>{
        return doc.data().email;
      })
    )
  }
  fetchUsers (){
    return this.firestore.collection('users').get()
    .pipe(map(resData=>{
      const users = [];
      resData.docs.map(doc=>{
        const usersDoc = doc.data();
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

  saveConversation(receiverId:string,receiverEmail:string,text:string){
    var senderIdCopy;
    var message;
    console.log("am intrat in save ")
    return this.authService.userId.pipe(
      take(1),
      map(userId=>{
        if(!userId)
          throw new Error("User not found");
        senderIdCopy = userId;
        return userId;
      }),
      switchMap(userId=>{
        return this.firestore.doc(`users/${userId}`)
        .get()
      }),
      map(doc=>{
        return doc.data().email;
      }),
      map((senderEmail)=>{
        message = new Message(receiverId,senderIdCopy,text,receiverEmail,senderEmail)
        return this.firestore.doc(`chat/${senderIdCopy}`).set({
            receiver:receiverId,
            sender:senderIdCopy,
            mesagges:text,
            receiverEmail:receiverEmail,
            senderEmail:senderEmail
        })
      }),
      switchMap(()=>{return this._messages}),
      take(1),
      tap((mesagges)=>{
        this._messages.next(mesagges.concat(message));
      })
    )
  }
}
