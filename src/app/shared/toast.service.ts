import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController:ToastController) { }

  async presentToast(message:string){
    const toast = await this.toastController.create({
      message,
      duration:4000
    });
    toast.present();
  }

  async presentToastWithError(message:string){
    const toast = await this.toastController.create({
      message,
      position:'top',
      duration:3000,
      cssClass:'toast-error'
    })
    toast.present();
  }
}
