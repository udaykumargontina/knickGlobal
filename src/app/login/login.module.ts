import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import {MatFormFieldModule,MatInputModule,  MatButtonModule, MatIconModule, MatSnackBarModule, MatToolbarModule} from '@angular/material';
import { AuthenticationService } from './authentication-service/authentication.service';
import { UserService } from './user-service/user.service';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [LoginComponent, RegistrationComponent, DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatToolbarModule


  ],
  providers: [
      AuthenticationService,
      UserService,
      AuthenticationService
  ],
})
export class LoginModule { }
