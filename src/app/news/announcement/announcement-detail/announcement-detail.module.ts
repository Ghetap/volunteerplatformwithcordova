import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { AnnouncementDetailPageRoutingModule } from './announcement-detail-routing.module';
import { AnnouncementDetailPage } from './announcement-detail.page';
import { SlidingItemComponent } from '../sliding-item/sliding-item.component';
import { ConversationItemComponent } from '../conversation-item/conversation-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnnouncementDetailPageRoutingModule
  ],
  declarations: [AnnouncementDetailPage,SlidingItemComponent,ConversationItemComponent]
})
export class AnnouncementDetailPageModule {}
