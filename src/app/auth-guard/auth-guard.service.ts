import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate } from '@angular/router';
import { RegistrationComponent } from '../base/login/registration/registration.component';
import { MatDialog } from '@angular/material';
import { CustomDialogComponent } from '../shared-module/custom-dialog/custom-dialog.component';
import { CustomDialogModel } from '../shared-module/custom-dialog/custom-dialog.component';
import { AuthenticationService } from '../base/login/authentication-service/authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanDeactivate<RegistrationComponent> {

  constructor(private router: Router, public dialog: MatDialog, private authenticationService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('userDetails')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  canDeactivate(component: RegistrationComponent) {
    const isFormDirty = component.registrationForm.dirty;
    if (isFormDirty) {
      const message = `Are you sure you want to Exit the Form?`;
      const dialogData = new CustomDialogModel("Confirm Action", message);
      const dialogRef = this.dialog.open(CustomDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if(dialogResult) {
          component.canDeactivate();
        } else {
          return false;
        }
      });
    } else {
      this.authenticationService.isRegistrationPage = false;
      return true;
    }
  }
}
