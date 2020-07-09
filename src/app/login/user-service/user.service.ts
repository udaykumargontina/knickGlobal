import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  loggedInUser;

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

  constructor(private fireStore: AngularFirestore) { }

  getUsersList():Observable<any> {
    return this.fireStore.collection('users').get();
  }

  deleteUser(user: any) {
    return this.fireStore.collection('users').doc(user.id).delete();
  }

  checkEmailAlreadyExists(email) {
    return this.fireStore.collection('users', ref => ref.where('email', '==', email )).snapshotChanges();
  }

  saveUser(user) {
    return this.fireStore.collection('users').add(user);
  }

  updateUser(user) {
    return this.fireStore.doc('users/' + this.selectedUser.id).update(user);
  }

}
