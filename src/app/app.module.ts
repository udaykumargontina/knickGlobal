import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Hash Location Strategy
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import { MaterialModule } from './shared-module/materials-loader';
import { AuthGuardService } from './auth-guard/auth-guard.service';
import { CustomDialogComponent } from './shared-module/custom-dialog/custom-dialog.component';
import { AuthenticationService } from './base/login/authentication-service/authentication.service';
import { UserService } from './base/login/user-service/user.service';

const firebaseConfig = {
  apiKey: "AIzaSyDrhIdZ32Ox1TqtZRJ8Sw4zv0NmOscd1is",
  authDomain: "knick-global-assessment.firebaseapp.com",
  databaseURL: "https://knick-global-assessment.firebaseio.com",
  projectId: "knick-global-assessment",
  storageBucket: "knick-global-assessment.appspot.com",
  messagingSenderId: "238003080136",
  appId: "1:238003080136:web:a5fdf637db42cbffda4efd",
  measurementId: "G-Q4KEHCSGM0"
};

@NgModule({
  declarations: [
    AppComponent,
    CustomDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [AuthGuardService, UserService, AuthenticationService, Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  entryComponents: [CustomDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
