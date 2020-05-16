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
    city:string,
    street:string,
    announcementPictureUrl:string,
    category:string
    ){
      var newAnnouncement;
      let docId = Math.random().toString();
      return this.authService.userId.pipe(
        take(1),
        map(userId=>{
          if(!userId){
            throw new Error('User not found!')
          }
          return userId;
        }),
        switchMap((userId)=>{
          console.log(userId)
          newAnnouncement = new Announcement(
            docId,
            title,
            description,
            money,
            startDate,
            endDate,
            userId,
            phone,
            city,
            street,
            category,
            0,
            announcementPictureUrl,
            [],
          )
          return of(newAnnouncement);
        }),
        take(1),
        map((data) =>{
          console.log(data);
          if(docId){
            console.log(docId);
            return this.firestore.doc(`announcements/${docId}`)
            .set({
              title:data.title,
              description:data.description,
              price:data.price,
              dateFrom:data.startDate,
              dateTo:data.endDate,
              userId:data.userId,
              announcementPictureUrl:data.announcementPictureUrl,
              phone:data.phone,
              city:data.city,
              street:data.street,
              category:data.category,
              numberofVisualisations:data.category,
              messages:data.messages
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
            announcemetDoc.phone,
            announcemetDoc.city,
            announcemetDoc.street,
            announcemetDoc.category,
            announcemetDoc.numberofVisualisations,
            announcemetDoc.announcementPictureUrl,
            announcemetDoc.messages,
            )
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
            announcemetDoc.phone,
            announcemetDoc.city,
            announcemetDoc.street,
            announcemetDoc.category,
            announcemetDoc.numberofVisualisations,
            announcemetDoc.announcementPictureUrl,
            announcemetDoc.messages)
        )
      })
      return announcements;
    }),
    tap(list=>{
      this._myannouncements.next(list);
    })
    );
  }
  updateAnnouncement(
    id:string, 
    title:string, 
    description:string, 
    money:number, 
    phone:string,
    announcementPictureUrl:string,
    newStartDate:Date,
    newEndDate:Date,
    category:string,
    city:string,
    street:string){
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
              newStartDate,
              newEndDate,
              oldAnnouncement.userId,
              phone,
              city,
              street,
              category,
              oldAnnouncement.numberofVisualisations,
              announcementPictureUrl,
              oldAnnouncement.messages);
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
