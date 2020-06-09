import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, } from 'rxjs';
import { UserProfile } from 'src/app/profile/userProfile.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { firestore } from 'firebase';

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
  
}
