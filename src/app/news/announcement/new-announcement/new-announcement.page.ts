import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ActionSheetController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewsService } from '../../news.service';

@Component({
  selector: 'app-new-announcement',
  templateUrl: './new-announcement.page.html',
  styleUrls: ['./new-announcement.page.scss'],
})
export class NewAnnouncementPage implements OnInit {

  selectedMode: 'select' | 'default';
  form:FormGroup;
  startDate: string;
  endDate:string;
  constructor(
    private router:Router,
    private loadingCtrl:LoadingController,
    private newsService:NewsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      title:new FormControl(null,{
        updateOn:'change',
        validators:[Validators.required]
      }),
      description: new FormControl(null,{
        updateOn:'change',
        validators:[Validators.required]
      }),
      price:new FormControl(null,{
        updateOn:'change',
        validators:[Validators.required,Validators.min(1)]
      }),
      phone: new FormControl(null,{
        updateOn:'change',
        validators:[Validators.required,Validators.maxLength(10), Validators.minLength(10)]
      }),
      startDate: new FormControl(null,{
        updateOn:'change',
        validators:[Validators.required]
      }),
      endDate: new FormControl(null,{
        updateOn:'change',
        validators:[Validators.required]
      })
    });
  }

  onCreateAnnouncement(){
    if(!this.form.valid || !this.datesValid){
      return ;
    }

    this.loadingCtrl.create({
      message:'Creating announcement...'
    }).then(loadingEl=>{
      loadingEl.present();
      this.newsService.addAnouncement(
        this.form.value.title,
        this.form.value.description,
        +this.form.value.price,
        this.form.value.phone,
        new Date(this.form.value.startDate),
        new Date(this.form.value.endDate),
      ).subscribe(()=>{
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/news/tabs/announcement']);
      })
    })
  }
  datesValid(){
    const startDate = new Date(this.form.value.startDate);
    const endDate = new Date(this.form.value.endDate);
    return endDate > startDate;
  }
}
