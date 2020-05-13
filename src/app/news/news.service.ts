import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of} from 'rxjs';
import { Announcement } from './announcement/announcement.model';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private _annoucements = new BehaviorSubject<Announcement[]>([]);  
  private _myannouncements = new BehaviorSubject<Announcement[]>([]);
  constructor(
    private authService:AuthService,
    private firestore:AngularFirestore) { 
    }

  get announcements(){
    return this._annoucements.asObservable();
  }

  get myannouncements(){
    return this._myannouncements.asObservable();
  }

  addAnouncement(
    title:string,
    description:string,
    money:number,
    phone:string,
    startDate:Date,
    endDate:Date,
    location:string
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
            startDate,
            endDate,
            userIdCopy,
            pictureUrl,
            phone,
            location
          )
          return of(newAnnouncement);
        }),
        map((data) =>{
          console.log(data);
          if(docId){
            console.log(docId);
            return this.firestore.doc(`announcements/${docId}`)
            .set({
              id:docId,
              title:data.title,
              description:data.description,
              price:data.price,
              dateFrom:data.startDate,
              dateTo:data.endDate,
              userId:data.userId,
              authorUrl:data.userPictureUrl,
              phone:data.phone,
              location:data.location
            })
          }
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
            announcemetDoc.dateFrom.toDate(),
            announcemetDoc.dateTo.toDate(),
            announcemetDoc.userId,
            announcemetDoc.authorUrl,
            announcemetDoc.phone,
            announcemetDoc.location)
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

  deleteAnouncementById(announcementId:string){
    return this.authService.userId.pipe(
      take(1),
      map(userId=>{
        if(!userId){
          throw new Error('User not found!')
        }
      }),
      switchMap(()=>{
        return this.firestore.collection('announcements')
        .doc(announcementId)
        .delete()
      }),
      switchMap(()=>{return this._annoucements}),
      take(1),
      tap(list=>{
        console.log(list);
        this._annoucements.next(list.filter(b=>{b.id !== announcementId}))
      })
    )
  }
  fetchMyAnnouncements(userId:string){
    return this.firestore.collection('announcements',ref=>ref.where('userId','==',userId)).get()
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
            announcemetDoc.dateFrom.toDate(),
            announcemetDoc.dateTo.toDate(),
            announcemetDoc.userId,
            announcemetDoc.authorUrl,
            announcemetDoc.phone,
            announcemetDoc.location)
        )
      })
      return announcements;
    }),
    tap(list=>{
      this._myannouncements.next(list);
    })
    );
  }
  updateAnnouncement(id:string, title:string, description:string, money:number,phone:string,location:string){
        let upadetNews = [];
        return this.myannouncements.pipe(
          take(1),
          switchMap( announcements=>{
            const toUpdateAnnouncementIndex = announcements.findIndex(an=>an.id===id);
            upadetNews = [...announcements];
            const oldAnnouncement = upadetNews[toUpdateAnnouncementIndex];
            upadetNews[toUpdateAnnouncementIndex] = new Announcement(
              oldAnnouncement.id,
              title,
              description,
              money,
              oldAnnouncement.startDate,
              oldAnnouncement.endDate,
              oldAnnouncement.userId,
              oldAnnouncement.userPictureUrl,
              phone,
              location);
              console.log(toUpdateAnnouncementIndex);
              console.log(upadetNews);
              return of(upadetNews);
        }),
        switchMap(()=>{
          if(id){
            console.log(id);
            return this.firestore.doc(`announcements/${id}`).update({
              title:title,
              description:description,
              price:money,
              phone:phone,
              location:location
            })
          }
        }),
        take(1),
        tap(()=> {
          this._annoucements.next(upadetNews);
        })
    )
  }
}
