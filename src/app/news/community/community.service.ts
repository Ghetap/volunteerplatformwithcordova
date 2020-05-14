import { Injectable } from '@angular/core';
import { BehaviorSubject, of, combineLatest } from 'rxjs';
import { UserProfile } from 'src/app/profile/userProfile.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Message } from './message.model';
import { collection } from 'rxfire/firestore';
import { firestore } from 'firebase';


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
        console.log(doc.data().email);
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

  getChat(chatId:string){
    return this.firestore.collection<any>('chat')
    .doc(chatId)
    .snapshotChanges()
    .pipe(map(doc=>{
      return {id: doc.payload.id, ...doc.payload.data }
    }))
  }

  async sendMessage(chatId:string,receiverId:string,receiverEmail:string,text:string){
    let senderId="";
    let senderEmail="";
    this.authService.userId.subscribe(userid=>{senderId=userid})
    this.getSenderEmail().subscribe(email=>senderEmail=email);
    const data = {
      senderId,
      senderEmail,
      receiverId,
      receiverEmail,
      text,
      date:Date.now(),
    }
    const ref = this.firestore.collection('chat').doc(chatId);
    return ref.update({
      messages : firestore.FieldValue.arrayUnion(data)
    })
  }
  
  // getConversationBetweenSenderReceiver(receiverId:string){
  //   console.log("getConversation");
  //     return this.authService.userId.pipe(
  //       take(1),
  //       map(userId=>{
  //         if(!userId){
  //           throw new Error("User not found!");
  //         }
  //         return userId;
  //       }),
  //       switchMap((userId)=>{
  //         const chatRef = this.firestore.collection('chat').ref;
  //         var senderReciverRef = chatRef.where('sender','==',userId).where('receiver','==',receiverId);
  //         var receiverSenderRef = chatRef.where('sender','==',receiverId).where('receiver','==',userId);
  //         var sR$ = collection(senderReciverRef)
  //         .pipe(map(messages => messages.map(c => c.data())));
  //         var rS$ = collection(receiverSenderRef)
  //         .pipe(map(messages => messages.map(c => c.data())));;
  //         return combineLatest(sR$,rS$);
  //       }),
  //       take(1),
  //       map(messages=>{
  //         var [senderReceiverMessages,receiverSenderMessages]=messages;
  //         return [
  //           ...senderReceiverMessages,
  //           ...receiverSenderMessages
  //         ]
  //       }),
  //       tap((messages)=>{
  //         const list=[];
  //         messages.map(item=>list.push(new Message(item.receiver,item.sender,item.text,item.receiverEmail,
  //           item.senderEmail,item.date)))
  //         return this._messages.next(list);
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
