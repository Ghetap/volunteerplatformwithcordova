import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { IonicModule} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './auth/auth.guard';
import { AngularFireModule } from '@angular/fire';
import { environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';
import { ToastService } from './shared/toast.service';
import { FcmService } from './shared/fcm.service';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot({driverOrder: ['localstorage']}),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuard,
    Firebase,
    ToastService,
    FcmService,
    LocalNotifications,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
