import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAnnouncementPageRoutingModule } from './edit-announcement-routing.module';

import { EditAnnouncementPage } from './edit-announcement.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditAnnouncementPageRoutingModule
  ],
  declarations: [EditAnnouncementPage]
})
export class EditAnnouncementPageModule {}
