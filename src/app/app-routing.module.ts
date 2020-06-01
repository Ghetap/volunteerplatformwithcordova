import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {  AuthGuard } from './auth/auth.guard';
const routes: Routes = [
  {
    path:'', redirectTo:'news', pathMatch:'full'
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule),
    canLoad:[AuthGuard]
  },
  {
    path:'auth',
    loadChildren:() => import('./auth/auth.module').then( m=> m.AuthPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canLoad:[AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
