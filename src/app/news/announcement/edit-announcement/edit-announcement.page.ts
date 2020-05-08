import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Announcement } from '../announcement.model';
import { NewsService } from 'src/app/news/news.service';

@Component({
  selector: 'app-edit-announcement',
  templateUrl: './edit-announcement.page.html',
  styleUrls: ['./edit-announcement.page.scss'],
})
export class EditAnnouncementPage implements OnInit {

  announcementtoBeEdited: Announcement;
  form:FormGroup;
  private editAnnouncementSub:Subscription;
  isLoading = false;
  announcementId:string;
  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private navCtrl: NavController,
    private router:Router,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('announcementId')) {
        this.navCtrl.navigateBack('/news/tabs/myannouncement');
        return;
      }
      this.announcementId = paramMap.get('announcementId');
      console.log(this.announcementId);
      this.isLoading = true;
      this.editAnnouncementSub = this.newsService.getDetailedAnnoucementById(paramMap.get('announcementId'))
      .subscribe(announcement=>{
        this.announcementtoBeEdited = new Announcement(
          announcement.id,
          announcement.title,
          announcement.description,
          +announcement.price,
          announcement.dateFrom.toDate(),
          announcement.dateTo.toDate(),
          announcement.userId,
          announcement.authorUrl,
          announcement.phone);

        this.form = new FormGroup({
          title:new FormControl(this.announcementtoBeEdited.title,{
            updateOn:'change',
            validators:[Validators.required]
          }),
          description: new FormControl(this.announcementtoBeEdited.description,{
            updateOn:'change',
            validators:[Validators.required,Validators.maxLength(180)]
          }),
          price:new FormControl(this.announcementtoBeEdited.price,{
            updateOn:'change',
            validators:[Validators.required,Validators.min(1)]
          }),
          phone: new FormControl(this.announcementtoBeEdited.phone,{
            updateOn:'change',
            validators:[Validators.required,Validators.maxLength(10), Validators.minLength(10)]
          }),
        });
        this.isLoading = false;
      },error=>{
        this.alertCtrl.create({
          header:'An error occured!',
          message:'Announcement could not be fetched. Please try again later!',
          buttons:[{text:'Okay',handler:()=>{
            this.router.navigate(['/news/tabs/myannouncement']);
          }}]
        }).then(alertEl=>{
          alertEl.present();
        })
      }); 
    });
  }
  ngOnDestroy(){
    if(this.editAnnouncementSub)
      this.editAnnouncementSub.unsubscribe();
  }
  onEditAnnouncement(){
    if(!this.form.valid){
      return ;
    }
    this.loadingCtrl.create({
      message:'Updating announcement...'
    }).then(loadingEl=>{
      loadingEl.present();
      this.newsService.updateAnnouncement(
        this.announcementtoBeEdited.id,
        this.form.value.title,
        this.form.value.description,
        this.form.value.price,
        this.form.value.phone
      ).subscribe(()=>{
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/news/tabs/announcement']);
      });
    })
  }
}
