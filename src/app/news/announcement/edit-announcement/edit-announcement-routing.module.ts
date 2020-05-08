import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAnnouncementPage } from './edit-announcement.page';

const routes: Routes = [
  {
    path: '',
    component: EditAnnouncementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAnnouncementPageRoutingModule {}
