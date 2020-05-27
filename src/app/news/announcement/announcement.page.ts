import { Component, OnInit, OnDestroy } from '@angular/core';
import { Announcement } from './announcement.model';
import { Subscription } from 'rxjs';
import { NewsService } from '../news.service';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
})
export class AnnouncementPage implements OnInit, OnDestroy {

  listLoadedAnnouncements:Announcement[];
  copyAnnouncements:Announcement[];

  private announcementSub:Subscription;
  isLoading = false;
  isSearchbarOpened=false;
  isFilterOpened=false;
  constructor(private newsService:NewsService,
    private menuCtrl:MenuController,
    private authService:AuthService) { 
    }

  ngOnInit() {
    this.announcementSub = this.newsService
    .announcements.subscribe(annoucements=>{
      annoucements.sort((a,b)=>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      this.listLoadedAnnouncements = annoucements;
      this.copyAnnouncements = annoucements;
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

  searchAfterInput(event:any){
    const input = event.target.value;
    const filteredList = [];
    this.copyAnnouncements.map((item)=>{
      if(item['city'].toUpperCase().includes(input.toUpperCase()) 
      || item['title'].toUpperCase().includes(input.toUpperCase())){
        filteredList.push(item);
      }
    })
    if(filteredList.length > 0)
     this.listLoadedAnnouncements = filteredList;
  }
  segmentChanged(event:any){
    const input = event.target.value;
    const filtereList = [];
    if(input ==='all'){
      this.copyAnnouncements.sort((a,b)=>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      this.listLoadedAnnouncements = this.copyAnnouncements;
    }
    else{
      this.copyAnnouncements.map((item)=>{
        if(item['category'] === input){
          filtereList.push(item);
        }
      })
      this.listLoadedAnnouncements = filtereList;
    }
  }
  onFilterUpdate(event:CustomEvent){
    this.authService.userId.pipe(take(1)).subscribe(userId=>{
      if(event.detail.value === 'all'){
        this.copyAnnouncements = this.listLoadedAnnouncements;
      }else{
        this.copyAnnouncements = this.listLoadedAnnouncements
        .filter(announcement=>announcement.userId !== userId);
      }
    })
  }
}
