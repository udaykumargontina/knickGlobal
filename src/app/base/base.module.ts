import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login/login.component';
import { RegistrationComponent } from './login/registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseRoutingModule } from './base-routing.module';
import { UserService } from './login/user-service/user.service';
import { DashboardComponent } from './login/dashboard/dashboard.component';
import { MaterialModule } from '../shared-module/materials-loader';
import { BaseComponent } from './base.component';

@NgModule({
  declarations: [BaseComponent, LoginComponent, RegistrationComponent, DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BaseRoutingModule,
    MaterialModule


  ],
  providers: [
  ],
})
export class BaseModule { }
