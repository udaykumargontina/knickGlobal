import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login/login.component';
import { RegistrationComponent } from './login/registration/registration.component';
import { DashboardComponent } from './login/dashboard/dashboard.component';
import { BaseComponent } from './base.component';
import { AuthGuardService } from '../auth-guard/auth-guard.service';

const routes: Routes = [
  { path: '', component: BaseComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent,
        canDeactivate: [AuthGuardService]},
      { path: 'dashboard', component: DashboardComponent,
        canActivate: [AuthGuardService] },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BaseRoutingModule { }
