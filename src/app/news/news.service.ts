import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, of} from 'rxjs';
import { Message } from './announcement/message.model';
import { Announcement } from './announcement/announcement.model';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './notifications/notification.model';


@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private _messages = new BehaviorSubject<Message[]>([]);
  private _notifications = new BehaviorSubject<Notification[]>([]);
  private _annoucements = new BehaviorSubject<Announcement[]>([]);  
  private 
  constructor(
    private authService:AuthService,
    private firestore:AngularFirestore) { 
    }

  get messages(){
    return this._messages.asObservable();
  }

  get announcements(){
    return this._annoucements.asObservable();
  }

  addAnouncement(
    title:string,
    description:string,
    money:number,
    ){
      var userIdCopy;
      var newAnnouncement;
      let docId = Math.random().toString();
      return this.authService.userId.pipe(
        take(1),
        map(userId=>{
          if(!userId){
            throw new Error('User not found!')
          }
          userIdCopy = userId;
          return userId;
        }),switchMap((userId)=>{
          var docRef = this.firestore.collection('users').doc(userId);
          return docRef.get()
        }),
        take(1),
        switchMap(userDocData=>{
          var data = userDocData.data();
          console.log(data);
          let dateFrom = new Date();
          let dateTo = new Date(dateFrom.getDate() +  12096e5);
          let pictureUrl=''
          if(data.imageUrl){
             pictureUrl=data.imageUrl;
          }
          console.log(userIdCopy);
          newAnnouncement = new Announcement(
            docId,
            title,
            description,
            money,
            dateFrom,
            dateTo,
            userIdCopy,
            pictureUrl,
          )
          return of(newAnnouncement);
        }),
        map((data) =>{
          console.log(data);
          return this.firestore.doc(`announcements/${docId}`)
            .set({
              id:docId,
              title:data.title,
              description:data.description,
              price:data.price,
              dateFrom:data.availableFrom,
              dateTo:data.availableTo,
              userId:data.userId,
              authorUrl:data.userPictureUrl
            })
        }),
        switchMap(()=>{return this._annoucements}),
        take(1),
        tap((announcements)=>{
          this._annoucements.next(announcements.concat(newAnnouncement));
        })
      )
  }

  fetchAnnouncements(){
   return this.firestore.collection('announcements').get()
    .pipe(map(resData=>{
      const announcements = [];
      resData.docs.map(doc=>{
        const announcemetDoc = doc.data();
        announcements.push(
          new Announcement(
            announcemetDoc.id,
            announcemetDoc.title,
            announcemetDoc.description,
            announcemetDoc.price,
            announcemetDoc.dateFrom,
            announcemetDoc.dateTo,
            announcemetDoc.userId,
            announcemetDoc.authorUrl)
        )
      })
      return announcements;
    }),
    tap(annoucements=>{
      this._annoucements.next(annoucements)
    })
    );
  }

  getDetailedAnnoucementById(announcementId:string){
   return this.firestore.collection('announcements')
   .doc(announcementId)
   .get()
   .pipe(map(resData=>{
     return resData.data();
   }));
  }

}
