import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { throwMatDialogContentAlreadyAttachedError, MatSnackBar } from '@angular/material';
import { UserService } from '../user-service/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  confirmPasswordNotMatched = false;
  updateMode = false;
  loggedInUser;
  userName='';

  constructor(
    public formBuilder: FormBuilder,
    private fireStore: AngularFirestore,
    private router: Router,
    public userService: UserService,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {
    let user = JSON.parse(localStorage.getItem('userDetails'));
    if(user) {
      this.userService.loggedInUser = user;
    }
    if(this.userService.selectedUser && this.userService.selectedUser.data)
        this.userService.selectedUser.data['confirmPassword'] = this.userService.selectedUser.data['password'];
    this.registrationForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      lastName: new FormControl(''),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
        Validators.minLength(6),
        Validators.maxLength(30)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15)
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15)
      ])),
    }, {
      validators: this.password.bind(this)
    });
  }

  ngOnInit() {
    console.log(this.userService.selectedUser);
    this.loggedInUser = JSON.parse(localStorage.getItem('userDetails'));
    console.log(this.loggedInUser);
    if(this.loggedInUser &&  this.loggedInUser.data) {
      this.userName = this.loggedInUser.data['firstName'];
    }

  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  onKeyUp() {
    this.confirmPasswordNotMatched = false;
    console.log(this.registrationForm);
    if(this.registrationForm.value['password'] !==  this.registrationForm.value['confirmPassword']) {
      this.confirmPasswordNotMatched = true;
    }
  }

  registrationClicked() {
    if (this.registrationForm.invalid) {
      return;
  }
    let data = this.registrationForm.value;
    delete data['confirmPassword'];
    if(this.userService.selectedUser.id === '') {
      this.userService.checkEmailAlreadyExists(data.email).subscribe(result => {
        if(result.length > 0) {
          this._snackBar.open('Email is Already Taken', '',{
            duration: 2000
          });
        } else {
          this.userService.saveUser(data).then(result => {
            this._snackBar.open('User Saved Successfully', '', {
              duration: 2000
            });
            window.location.reload();
        });
        }
      })
    } else {
      this.userService.updateUser(data).then(result => {
        this._snackBar.open('User Updated Successfully', '', {
          duration: 2000
        });
        this.router.navigate(['/dashboard']);
      });
    }
  }
  loginClicked() {
    this.router.navigate(['/login']);
  }
  logoutClicked() {
    this.authenticationService.logout();
  }
}
