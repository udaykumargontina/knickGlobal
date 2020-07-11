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
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';

// const firebaseConfig = {
//   apiKey: "AIzaSyDrhIdZ32Ox1TqtZRJ8Sw4zv0NmOscd1is",
//   authDomain: "knick-global-assessment.firebaseapp.com",
//   databaseURL: "https://knick-global-assessment.firebaseio.com",
//   projectId: "knick-global-assessment",
//   storageBucket: "knick-global-assessment.appspot.com",
//   messagingSenderId: "238003080136",
//   appId: "1:238003080136:web:a5fdf637db42cbffda4efd",
//   measurementId: "G-Q4KEHCSGM0"
// };

const firebaseConfig = {
  apiKey: "AIzaSyD0UL_mS6X60vh-r2bfUw1Irle4qFH-mWY",
  authDomain: "knick-global-assessment-6b075.firebaseapp.com",
  databaseURL: "https://knick-global-assessment-6b075.firebaseio.com",
  projectId: "knick-global-assessment-6b075",
  storageBucket: "knick-global-assessment-6b075.appspot.com",
  messagingSenderId: "762034224773",
  appId: "1:762034224773:web:003d84519c04505c8273ec",
  measurementId: "G-V54M37L1YE"
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
    AngularFireStorageModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [AuthGuardService, UserService, AuthenticationService, Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  entryComponents: [CustomDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
