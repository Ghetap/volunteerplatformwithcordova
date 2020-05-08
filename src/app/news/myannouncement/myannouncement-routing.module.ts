import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyannouncementPage } from './myannouncement.page';

const routes: Routes = [
  {
    path: '',
    component: MyannouncementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyannouncementPageRoutingModule {}
