import { Component, OnInit, OnDestroy } from '@angular/core';
import { Announcement } from './announcement.model';
import { Subscription } from 'rxjs';
import { NewsService } from '../news.service';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';
import { FcmService } from 'src/app/shared/fcm.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
})
export class AnnouncementPage implements OnInit, OnDestroy {

  listLoadedAnnouncements:Announcement[];
  filteredAnnouncements:Announcement[];

  height = Math.floor(Math.random() * 50 + 150);
  private announcementSub:Subscription;
  isLoading = false;
  constructor(private newsService:NewsService,
    private menuCtrl:MenuController,
    private authService:AuthService,
    private fcmService:FcmService) { 
      this.fcmService.receiveMessage();
    }

  ngOnInit() {
    this.announcementSub = this.newsService
    .announcements.subscribe(annoucements=>{
      this.listLoadedAnnouncements = annoucements;
      this.filteredAnnouncements = annoucements;
    })
  }
  ionViewWillEnter(){
    this.isLoading = true;
    this.newsService.fetchAnnouncements().subscribe(()=>{
      this.isLoading = false;
    })
  }

  ngOnDestroy(){
    if(this.announcementSub){
      this.announcementSub.unsubscribe();
    }
  }

  onOpenMenu(){
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event:CustomEvent){
    this.authService.userId.pipe(take(1)).subscribe(userId=>{
      if(event.detail.value === 'all'){
        this.filteredAnnouncements = this.listLoadedAnnouncements;
      }else{
        this.filteredAnnouncements = this.listLoadedAnnouncements
        .filter(announcement=>announcement.userId !== userId);
      }
    })
  }
}
