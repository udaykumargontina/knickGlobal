import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service/user.service';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication-service/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  usersList = [];
  loggedInUser;
  userName;

  constructor(public userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('./assets/svgs/edit.svg'));
      iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('./assets/svgs/delete.svg'));
     }

  ngOnInit() {
    this.userService.selectedUser  = JSON.parse(localStorage.getItem('userDetails'));
    this.userService.getUsersList().subscribe(users => {
      console.log(users);
     users.docs.forEach(user => this.usersList.push({data: user.data(),id:user.id}));
    })
    console.log(this.userService.selectedUser.id);
    this.loggedInUser = JSON.parse(localStorage.getItem('userDetails'));
    console.log(this.loggedInUser);
    if(this.loggedInUser &&  this.loggedInUser.data) {
      this.userName = this.loggedInUser.data['firstName'];
    }
  }

  editIconClicked(user) {
    console.log(user);
    this.userService.selectedUser = user;
    this.router.navigate(['/registration']);
  }

  deleteIconClicked(user) {
    this.userService.deleteUser(user).then(result => {
      console.log(result);
      this.usersList = this.usersList.filter(item => {
        return item.id !== user.id;
      })
    })
    this._snackBar.open('User Deleted Successfully', '',{
      duration: 2000
    })
  }

  logoutClicked() {
    this.authenticationService.logout();
  }

}
