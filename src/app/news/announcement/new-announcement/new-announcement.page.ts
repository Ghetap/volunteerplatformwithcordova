import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewsService } from '../../news.service';

@Component({
  selector: 'app-new-announcement',
  templateUrl: './new-announcement.page.html',
  styleUrls: ['./new-announcement.page.scss'],
})
export class NewAnnouncementPage implements OnInit {

  form:FormGroup;
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
        validators:[Validators.required,Validators.maxLength(180)]
      }),
      price:new FormControl(null,{
        updateOn:'change',
        validators:[Validators.required,Validators.min(1)]
      })
    });
  }

  onCreateAnnouncement(){
    if(!this.form.valid){
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
      ).subscribe(()=>{
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/news/tabs/announcement']);
      })
    })
  }
}
