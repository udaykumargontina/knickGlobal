import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

  constructor(private fireStore: AngularFirestore, private router: Router) { }

  isLoggedIn: boolean;

  login(email: string, password: string): Observable<any> {
    return this.fireStore.collection('users', ref => ref.where('email', '==', email )
    .where('password', '==', password)).snapshotChanges();
  }

  logout() {
    localStorage.removeItem('userDetails');
    this.router.navigate(['/login']);
  }
}
