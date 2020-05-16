import { Component, OnInit, OnDestroy } from '@angular/core';
import { Announcement } from '../announcement/announcement.model';
import { Subscription } from 'rxjs';
import { LoadingController, IonItemSliding } from '@ionic/angular';
import { NewsService } from '../news.service';
import { AuthService } from 'src/app/auth/auth.service';
import { take, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myannouncement',
  templateUrl: './myannouncement.page.html',
  styleUrls: ['./myannouncement.page.scss'],
})
export class MyannouncementPage implements OnInit,OnDestroy {

  myNews:Announcement[];
  private myNewsSub:Subscription;
  isLoading = false;
  constructor(
    private newsService:NewsService,
    private loadingCtrl:LoadingController,
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
   this.myNewsSub = this.newsService.myannouncements
    .subscribe(myannouncements=>{
      this.myNews = myannouncements;
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.authService.userId.pipe(
      take(1),
      map(userId=>{
        if (!userId){
          throw new Error('User not found');
        }
        this.newsService.fetchMyAnnouncements(userId).subscribe();
      })
    ).subscribe(()=>this.isLoading=false);
  }
  ngOnDestroy(){
    if(this.myNewsSub)
      this.myNewsSub.unsubscribe();
  }
  onDeleteAnnouncement(Id:string,slidingAnnouncement:IonItemSliding){
    slidingAnnouncement.close();
    this.loadingCtrl.create({
      message:'Deleting...'
    }).then(loadingEl=>{
      loadingEl.present();
      console.log(Id);
      this.newsService.deleteAnouncementById(Id).subscribe(()=>{
        loadingEl.dismiss();
        this.router.navigate(['/news/tabs/announcement']);
      })
    })
  }
  onUpdateAnnouncement(id:string,slidingAnnouncement:IonItemSliding){
    slidingAnnouncement.close();
    this.router.navigate(['/','news','tabs','announcement','edit',id]);
  }
}
