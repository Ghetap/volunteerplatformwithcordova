import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from '../../news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { Announcement } from '../announcement.model';

import { Subscription } from 'rxjs';
import { UserProfile } from 'src/app/profile/userProfile.model';

import { ChatService } from '../../chat/chat.service';
import { Conversation } from '../conversation-item/conversation.model';

@Component({
  selector: 'app-announcement-detail',
  templateUrl: './announcement-detail.page.html',
  styleUrls: ['./announcement-detail.page.scss'],
})
export class AnnouncementDetailPage implements OnInit,OnDestroy {

  announcement:Announcement;
  announcementId;
  annoucementDetailSub:Subscription;
  isLoading:boolean = false;
  announcementAuthor:UserProfile
  currentUserEmail:string;
  conversations:Conversation[];
  constructor(
    private newsService:NewsService,
    private route:ActivatedRoute,
    private router:Router,
    private navCtrl:NavController,
    private loadingCtrl:LoadingController,
    private chatService:ChatService,
    private alertCtrl:AlertController) { }

  ngOnInit() {
    this.annoucementDetailSub = this.route.paramMap.subscribe(
      paramMap=>{
        if(!paramMap.has('announcementId')){
            this.navCtrl.navigateBack('/news/tabs/announcement');
            return;
        }
        this.announcementId = paramMap.get('announcementId');
        this.isLoading = true;
        return this.newsService.getDetailedAnnoucementById(paramMap.get('announcementId'))  
        .subscribe(announcement=>{
          this.announcement = new Announcement(
            announcement.id,
            announcement.title,
            announcement.description,
            announcement.price,
            announcement.dateFrom.toDate(),
            announcement.dateTo.toDate(),
            announcement.userId,
            announcement.phone,
            announcement.city,
            announcement.street,
            announcement.category,
            announcement.numberOfVisualisations,
            announcement.announcementPictureUrl);
            console.log(announcement)
            this.newsService.incrementNumberofViews(this.announcement.id,this.announcement.numberOfVisualisations+1).subscribe();
            this.getAuthor();
            this.chatService.getSenderEmail().subscribe(email=>{
              this.currentUserEmail=email;
            });
            this.isLoading = false;
          },error=>{
            this.alertCtrl.create({
              header:'An error occured',
              message:'Could not load annoucement by id',
              buttons:[{
                text:'Okay',
                handler:()=>{
                  this.router.navigate(['/news/tabs/annoucement']);
                }
              }]
            }).then(alertEl=>alertEl.present())
        })
      }
    )
  }
  ngOnDestroy(){
    if(this.annoucementDetailSub){
      this.annoucementDetailSub.unsubscribe();
    }
  }

  getAuthor(){
    this.newsService.getAnnouncementAuthorById(this.announcement.userId).subscribe(author=>this.announcementAuthor=author);
  }
  onSendMessage(receiverEmail:string,slidingAuthor:IonItemSliding){
    slidingAuthor.close();
 
      let senderEmail;
      this.chatService.getSenderEmail().subscribe(email=>{
          senderEmail=email
        this.chatService.chatExists(this.announcement.id).subscribe(snapshot=>{
            if(!snapshot.exists)
              this.chatService.create(this.announcement.id);
            this.router.navigate(['/','news','tabs','chat',this.announcementId,senderEmail,receiverEmail]);
          })
      });
  }
}
