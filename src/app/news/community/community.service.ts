import { Injectable } from '@angular/core';
import { BehaviorSubject, of, combineLatest, Observable } from 'rxjs';
import { UserProfile } from 'src/app/profile/userProfile.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { firestore } from 'firebase';

interface Message{
  email:string,
  text:string,
  date:Date
}
interface Item{
  email:string,
  date:Date,
  messages:Message[]
}
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
      }),
      take(1),
      map((doc)=>{
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

  getChat(email1:string,email2:string){
    return this.firestore.collection<any>('chats')
    .doc(email1+'+'+email2)
    .snapshotChanges()
    .pipe(map(doc=>{
      return {id: doc.payload.id, ...doc.payload.data() as Item}
    }))
  }

  chatExists(email1:string,email2:string){
    return this.firestore.collection<any>('chats').doc(email1+'+'+email2).get()
  }
  async create(receiverEmail:string,senderEmail:string){
    console.log("am intrat in create document");
    const data = {
      senderEmail,
      receiverEmail,
      date:Date.now(),
      messages:[]
    }
    let docId
    const docRef = await this.firestore.collection(`chats/${receiverEmail+'+'+senderEmail}`).add(data);
    return docRef.get()
  }
  sendMessage(docId:string, text:string,email:string){
    console.log(docId)
    const data = {
      email,
      text,
      date:Date.now(),
    }
    console.log(email);
    const ref = this.firestore.collection('chats').doc(docId);
    return ref.update({
      messages : firestore.FieldValue.arrayUnion(data)
    })
  }
  
  // getConversationBetweenSenderReceiver(chat$:Observable<any>, receiverEmail:string,senderEmail:string){
  //   console.log("getConversation");
  //   let chat;
  //     return chat$.pipe(
  //       switchMap(c=>{
  //         chat = c;
  //         console.log(chat);
  //         var senderReciverRef = c.where('senderEmail','in',[senderEmail,receiverEmail])
  //         var receiverSenderRef = c.where('reiceiverEmail','in',[senderEmail,receiverEmail]);
  //         var sR$ = collection(senderReciverRef)
  //         .pipe(map(messages => messages.map(c => c.data())));
  //         var rS$ = collection(receiverSenderRef)
  //         .pipe(map(messages => messages.map(c => c.data())));;
  //         return combineLatest(sR$,rS$);
  //       }),
  //       map(messages=>{
  //         var [senderReceiverMessages,receiverSenderMessages]=messages;
  //         chat.messages = [
  //           ...senderReceiverMessages,
  //           ...receiverSenderMessages
  //         ]
  //         console.log(chat.messages);
  //         return chat;
  //       })
  //     )
  // }
  // saveConversation(docId:string,receiverId:string,receiverEmail:string,text:string,date:Date){
  //   var senderIdCopy;
  //   var message;
  //   return this.authService.userId.pipe(
  //     take(1),
  //     map(userId=>{
  //       if(!userId)
  //         throw new Error("User not found");
  //       senderIdCopy = userId;
  //       return userId;
  //     }),
  //     switchMap(userId=>{
  //       return this.firestore.doc(`users/${userId}`)
  //       .get()
  //     }),
  //     map(doc=>{
  //       return doc.data().email;
  //     }),
  //     map((senderEmail)=>{
  //       message = new Message(receiverId,senderIdCopy,text,receiverEmail,senderEmail,date)
  //       return this.firestore.doc(`chat/${docId}`).set({
  //           receiver:receiverId,
  //           sender:senderIdCopy,
  //           text:text,
  //           receiverEmail:receiverEmail,
  //           senderEmail:senderEmail,
  //           date:date
  //       })
  //     }),
  //     switchMap(()=>{return this._messages}),
  //     take(1),
  //     tap((mesagges)=>{
  //        return this._messages.next(mesagges.concat(message));
  //     })
  //   )
  // }
}
