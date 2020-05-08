import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyannouncementPageRoutingModule } from './myannouncement-routing.module';
import { MyannouncementPage } from './myannouncement.page';
import { AnnouncementItemComponent } from '../announcement/announcement-item/announcement-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyannouncementPageRoutingModule
  ],
  declarations: [MyannouncementPage,AnnouncementItemComponent]
})
export class MyannouncementPageModule {}
