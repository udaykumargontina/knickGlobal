import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class UserService {

  loggedInUser = {};

  selectedUser = {
    id: '',
    data: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  };

  userName;

  constructor(private fireStore: AngularFirestore) {
    this.initDataStorage();
   }

   initDataStorage() {
    const loggedInUser = JSON.parse(localStorage.getItem('userDetails'));
    if (loggedInUser &&  loggedInUser.data) {
      this.loggedInUser = Object.assign({}, loggedInUser);
      this.userName = loggedInUser.data['firstName'] + ' ' + loggedInUser.data['lastName'];
    }
    const editUser = JSON.parse(localStorage.getItem('editUser'));
    if (editUser) {
      this.selectedUser = Object.assign({}, editUser);
    }
    if (this.selectedUser && this.selectedUser.data) {
      this.selectedUser.data['confirmPassword'] = this.selectedUser.data['password'];
    }
   }

  getUsersList(): Observable<any> {
    return this.fireStore.collection('users').get();
  }

  deleteUser(user: any) {
    return this.fireStore.collection('users').doc(user.id).delete();
  }

  checkEmailAlreadyExists(email) {
    return this.fireStore.collection('users', ref => ref.where('email', '==', email )).snapshotChanges().pipe(
     take(1)
    );
  }

  saveUser(user) {
    return this.fireStore.collection('users').add(user);
  }

  updateUser(user) {
    return this.fireStore.doc('users/' + this.selectedUser.id).update(user);
  }

  // updateUser(user) {
  //   return this.fireStore.
  // }

}
