import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnouncementPage } from './announcement.page';

const routes: Routes = [
  {
    path: '',
    component: AnnouncementPage
  },
  {
    path: 'new-announcement',
    loadChildren: () => import('./new-announcement/new-announcement.module').then( m => m.NewAnnouncementPageModule)
  },
  {
    path: 'announcement-detail',
    loadChildren: () => import('./announcement-detail/announcement-detail.module').then( m => m.AnnouncementDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnouncementPageRoutingModule {}
