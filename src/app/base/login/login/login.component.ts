import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../authentication-service/authentication.service";
import { MatSnackBar } from "@angular/material";
import { UserService } from "../user-service/user.service";
import * as bcrypt from "bcryptjs";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  loginSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.authenticationService.isLoggedIn = false;
    localStorage.clear();
    this.userService.loggedInUser = {};
    this.userService.selectedUser = {
      id: "",
      data: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        imageUrl: ""
      },
    };
    this.loginForm = this.formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-z]{2,3}$/),
          Validators.minLength(4),
          Validators.maxLength(30),
        ]),
      ],
      password: ["", Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  loginClicked() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.loginSubscription = this.authenticationService
      .login(this.loginForm.value["email"])
      .subscribe((data) => {
        if (data.length > 0) {
          bcrypt.compare(
            this.loginForm.value["password"],
            data[0].payload.doc.data().password,
            (err, result) => {
              if (result) {
                this.userService.selectedUser = {
                  id: data[0].payload.doc.id,
                  data: data[0].payload.doc.data(),
                };
                this.authenticationService.isLoggedIn = true;
                this.userService.loggedInUser = this.userService.selectedUser;
                localStorage.setItem(
                  "userDetails",
                  JSON.stringify({
                    id: data[0].payload.doc.id,
                    data: data[0].payload.doc.data(),
                  })
                );
                this.userService.userName =
                  this.userService.selectedUser.data.firstName +
                  " " +
                  this.userService.selectedUser.data.lastName;
                this.loading = false;
                this.loginSubscription.unsubscribe();
                this.router.navigate(["/dashboard"]);
              } else {
                this.snackBar.open("Invalid Credentials", "", {
                  duration: 2000,
                });
                this.loading = false;
              }
              if (err) {
                this.snackBar.open(err, "", {
                  duration: 2000,
                });
                this.loginSubscription.unsubscribe();
                this.loading = false;
                console.log(err);
              }
            }
          );
        } else {
          this.snackBar.open("Invalid Credentials", "", {
            duration: 2000,
          });
          this.loading = false;
        }
      });
  }
}
