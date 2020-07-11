import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from './login/user-service/user.service';
import { AuthenticationService } from './login/authentication-service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit {

  imageSrc: string = "/assets/dummyuser.png";

  constructor(public userService: UserService, private router: Router,
              public authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.userService.initDataStorage();
    if (this.userService.loggedInUser && this.userService.loggedInUser['data']) {
      this.authenticationService.isLoggedIn = true;
    }
  }

  signUpClicked() {
    this.authenticationService.isRegistrationPage = true;
    this.router.navigate(['/registration']);
  }

  loginClicked() {
    this.router.navigate(['/login']);
  }

  logoutClicked() {
    this.authenticationService.logout();
  }

  dashboardClicked() {
    this.router.navigate(['/dashboard']);
  }

}
