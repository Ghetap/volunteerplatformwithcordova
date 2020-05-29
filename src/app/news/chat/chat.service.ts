import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, } from 'rxjs';
import { UserProfile } from 'src/app/profile/userProfile.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { firestore } from 'firebase';
import { Conversation } from '../announcement/conversation-item/conversation.model';

interface Message{
  senderEmail,
  receiverEmail,
  text:string,
  date:Date
}
interface Item{
  date:Date,
  messages:Message[]
}
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _messages = new BehaviorSubject<Message[]>([]);
  private _conversations = new BehaviorSubject<Conversation[]>([]);
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
 
  getChat(docId:string){
    return this.firestore.collection<any>('chats')
    .doc(docId)
    .snapshotChanges()
    .pipe(map(doc=>{
      return {id: doc.payload.id, ...doc.payload.data() as Item}
    }))
  }
   
  chatExists(docId:string){
    return this.firestore.collection<any>('chats').doc(docId).get()
  }
  create(docId:string){
    console.log("am intrat in create document");
    const data = {
      date:Date.now(),
      messages:[]
    }
    return this.firestore.collection('chats').doc(docId).set(data);
  }
  sendMessage(docId:string, text:string,senderEmail:string,receiverEmail:string){
    const data = {
      senderEmail,
      receiverEmail,
      text,
      date:Date.now(),
    }
    const ref = this.firestore.collection('chats').doc(docId);
    return ref.update({
      messages : firestore.FieldValue.arrayUnion(data)
    })
  }
  getConversations(email:string,docId:string){
    return this.firestore.collection<any>('chats').doc(docId).get()
    .pipe(
      take(1),
      map((doc)=>{
        console.log(doc.data());
        const conversation=[]
        if(doc){
           doc.data().messages.map(message=>{
          if((message.receiverEmail === email && message.senderEmail !== email)){
            conversation.push(new Conversation("",message.senderEmail))
          }else if(message.senderEmail === email && message.receiverEmail !== email){
            conversation.push(new Conversation("",message.receiverEmail))
          }
        })
        }
      return conversation;
    }),
    tap(list=>{
      console.log(list);
      this._conversations.next(list);
    })
    )
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
