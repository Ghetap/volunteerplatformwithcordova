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
        path:'myannouncement',children:[
          {
            path: '',
            loadChildren: () => import('./myannouncement/myannouncement.module').then( m => m.MyannouncementPageModule)
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
          path:'edit/:announcementId',
          loadChildren: () => import('./announcement/edit-announcement/edit-announcement.module').then( m => m.EditAnnouncementPageModule)  
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
          },
          {
            path: ':receiverId/:receiverEmail/:senderEmail',
            loadChildren: () => import('./community/chat/chat.module').then( m => m.ChatPageModule)
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
