import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserProfile } from '../userProfile.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  userToEdit:UserProfile;
  form:FormGroup;
  private editProfileSub:Subscription;
  isLoading = false;
  userId:string;
  constructor(
    private profileService:ProfileService,
    private router:Router,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    private astorage:AngularFireStorage
  ) {}

  ngOnInit() {
      this.isLoading = true;
      this.editProfileSub = this.profileService.getUserDetails()
      .subscribe((userDetails)=>{
        this.userToEdit = new UserProfile(
          userDetails.id,
          userDetails.email,
          userDetails.firstname,
          userDetails.lastname,
          userDetails.profession,
          userDetails.where,
          userDetails.imageUrl,
          userDetails.description);
        this.form = new FormGroup({
          profilePhoto:new FormControl(this.userToEdit.imageUrl,{
            updateOn:'change',
           //validators:[Validators.required]
          }),
          firstname: new FormControl(this.userToEdit.firstname ? this.userToEdit.firstname: '',{
            updateOn:'change',
            validators:[Validators.required]
          }),
          lastname:new FormControl(this.userToEdit.lastname ? this.userToEdit.lastname: '',{
            updateOn:'change',
           validators:[Validators.required]
          }),
          description: new FormControl(this.userToEdit.description ? this.userToEdit.description: '',{
            updateOn:'change',
            //validators:[Validators.required]
          }),
          profession: new FormControl(this.userToEdit.profession ? this.userToEdit.profession: '',{
            updateOn:'change',
            validators:[Validators.required]
          }),
          where:new FormControl(this.userToEdit.where ? this.userToEdit.where: '',{
            updateOn:'change',
            validators:[Validators.required]
          }),
        });
        this.isLoading = false;
      },error=>{
        this.alertCtrl.create({
          header:'An error occured!',
          message:' User could not be fetched. Please try again later!',
          buttons:[{text:'Okay',handler:()=>{
            this.router.navigateByUrl('/profile');
          }}]
        }).then(alertEl=>{
          alertEl.present();
        })
      }); 
  }
  onFileChange(event) {
    var file = event.target.files[0];
    this.uploadPicture(file);
  }
  async uploadPicture(imageUri){
    const storageRef = this.astorage.storage.ref(`usersProfile/${imageUri.name}`);
    await storageRef.put(imageUri);
    this.form.patchValue({
      profilePhoto:await storageRef.getDownloadURL()
    })
  }
  ngOnDestroy(){
    if(this.editProfileSub)
      this.editProfileSub.unsubscribe();
  }
  onEditProfile(){
    if(!this.form.valid){
      return ;
    }
    this.loadingCtrl.create({
      message:'Editing profile...'
    }).then(loadingEl=>{
      loadingEl.present();
     // console.log(this.form.value.profilePhoto);
      this.profileService.updateUserProfile(
        this.form.value.firstname,
        this.form.value.lastname,
        this.form.value.description,
        this.form.value.profilePhoto,
        this.form.value.profession,
        this.form.value.where
      ).subscribe(()=>{
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigateByUrl('/profile');
      });
    })
  }
}
