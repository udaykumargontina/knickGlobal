import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service/user.service';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication-service/authentication.service';


export interface UserDetails {
  id: string;
  data: {
    firstName: string;
    lastName: number;
    email: number;
    password: string;
    imageUrl: string;
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns = ['email', 'firstName', 'lastName', 'edit', 'delete'];
  usersList: UserDetails[] = [];

  constructor(public userService: UserService,
    private router: Router, private snackBar: MatSnackBar,
    private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('./assets/svgs/edit.svg'));
      iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('./assets/svgs/delete.svg'));
     }

  ngOnInit() {
    this.userService.getUsersList().subscribe(users => {
     users.docs.forEach(user => this.usersList.push({data: user.data(), id: user.id}));
    });
  }

  editIconClicked(user) {
    localStorage.setItem('editUser', JSON.stringify(user));
    this.userService.selectedUser = user;
    this.router.navigate(['/registration']);
  }

  deleteIconClicked(user) {
    this.userService.deleteUser(user).then(result => {
      this.usersList = this.usersList.filter(item => {
        return item.id !== user.id;
      });
    });
    this.snackBar.open('User Deleted Successfully', '', {
      duration: 2000
    });
  }

}
