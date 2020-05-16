import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Announcement } from '../announcement.model';
import { NewsService } from 'src/app/news/news.service';
import { AngularFireStorage } from '@angular/fire/storage';

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
    private astorage:AngularFireStorage,
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
          announcement.price,
          announcement.dateFrom.toDate(),
          announcement.dateTo.toDate(),
          announcement.userId,
          announcement.phone,
          announcement.city,
          announcement.street,
          announcement.category,
          announcement.numberofVisualisations,
          announcement.announcementPictureUrl,
          announcement.messages);

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
          city:new FormControl(this.announcementtoBeEdited.city,{
            updateOn:'change',
            validators:[Validators.required,Validators.min(1)]
          }),
          street:new FormControl(this.announcementtoBeEdited.street,{
            updateOn:'change',
            validators:[Validators.required,Validators.min(1)]
          }),
          category:new FormControl(this.announcementtoBeEdited.category,{
            updateOn:'change',
            validators:[Validators.required]
          }),
          announcementPicture:new FormControl(this.announcementtoBeEdited.announcementPictureUrl,{
            updateOn:'change',
            validators:[Validators.required]
          }),
          startDate: new FormControl(this.announcementtoBeEdited.startDate,{
            updateOn:'change',
            validators:[Validators.required]
          }),
          endDate: new FormControl(this.announcementtoBeEdited.endDate,{
            updateOn:'change',
            validators:[Validators.required]
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
    if(!this.form.valid || !this.datesValid){
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
        +this.form.value.price, 
        this.form.value.phone,
        this.form.value.announcementPictureUrl,
        this.form.value.startDate,
        this.form.value.endDate,
        this.form.value.category,
        this.form.value.city,
        this.form.value.street
      ).subscribe(()=>{
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/news/tabs/announcement']);
      });
    })
  }
  datesValid(){
    const startDate = new Date(this.form.value.startDate);
    const endDate = new Date(this.form.value.endDate);
    return endDate > startDate;
  }
  onFileChange(event) {
    var file = event.target.files[0];
    this.uploadPicture(file);
      
  }
  async uploadPicture(imageUri){
    const storageRef = this.astorage.storage.ref(`announcements/${imageUri.name}`);
    await storageRef.put(imageUri);
    this.form.patchValue({
      announcementPicture:await storageRef.getDownloadURL()
    })
  }
}
