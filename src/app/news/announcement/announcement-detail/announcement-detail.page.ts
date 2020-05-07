import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from '../../news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { Announcement } from '../announcement.model';
import { AuthService } from 'src/app/auth/auth.service';
import { take, map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-announcement-detail',
  templateUrl: './announcement-detail.page.html',
  styleUrls: ['./announcement-detail.page.scss'],
})
export class AnnouncementDetailPage implements OnInit,OnDestroy {

  announcement:Announcement;
  annoucementDetailSub:Subscription;
  isLoading:boolean = false;
  constructor(
    private newsService:NewsService,
    private route:ActivatedRoute,
    private router:Router,
    private navCtrl:NavController,
    private alertCtrl:AlertController,
    private authService:AuthService) { }

  ngOnInit() {
    this.annoucementDetailSub = this.route.paramMap.subscribe(
      paramMap=>{
        if(!paramMap.has('announcementId')){
            this.navCtrl.navigateBack('/news/tabs/announcement');
            return;
        }
        this.isLoading = true;
        return this.newsService.getDetailedAnnoucementById(paramMap.get('announcementId'))  
        .subscribe(announcement=>{
          this.announcement = new Announcement(
            announcement.id,
            announcement.title,
            announcement.description,
            +announcement.price,
            announcement.dateFrom.toDate(),
            announcement.dateTo.toDate(),
            announcement.userId,
            announcement.authorUrl);
            this.isLoading = false;
            console.log(this.announcement);
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

}
