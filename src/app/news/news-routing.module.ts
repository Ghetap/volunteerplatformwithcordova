import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsPage } from './news.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: NewsPage,
    children:[
      {
        path: 'notifications',children:[
          {
            path:'',
            loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
          }
        ]
      },
      {
        path:'announcement',children:[
          {
            path: '',
            loadChildren: () => import('./announcement/announcement.module').then( m => m.AnnouncementPageModule)
         },
         {
           path:'new',
           loadChildren:() => import('./announcement/new-announcement/new-announcement.module').then(m =>m.NewAnnouncementPageModule)
         },
         {
           path:':announcementId',
           loadChildren:() => import('./announcement/announcement-detail/announcement-detail.module').then( m => m.AnnouncementDetailPageModule)
         }
        ]
      },
      {
        path: 'community',children:[
          {
            path:'',
            loadChildren: () => import('./community/community.module').then( m => m.CommunityPageModule)
          }
        ]
      },
      {
        path:'',
        redirectTo:'/news/tabs/announcement',
        pathMatch:'full'
      }
    ]
  },
  {
    path:'',
    redirectTo:'/news/tabs/announcement',
    pathMatch:'full'
  },
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsPageRoutingModule {}
