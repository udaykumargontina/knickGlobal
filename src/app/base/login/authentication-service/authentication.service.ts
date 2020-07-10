import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../user-service/user.service';

@Injectable()
export class AuthenticationService {

  constructor(private fireStore: AngularFirestore, private router: Router, private userService: UserService) { }

  isLoggedIn: boolean = false;
  isRegistrationPage: boolean = false;

  login(email: string, password: string): Observable<any> {
    return this.fireStore.collection('users', ref => ref.where('email', '==', email )
    .where('password', '==', password)).snapshotChanges();
  }

  logout() {
    this.isLoggedIn = false;
    this.userService.selectedUser = {
      id: '',
      data: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    };
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
