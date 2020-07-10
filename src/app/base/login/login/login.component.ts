import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../authentication-service/authentication.service";
import { MatSnackBar } from "@angular/material";
import { UserService } from "../user-service/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

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
    this.authenticationService
      .login(this.loginForm.value["email"], this.loginForm.value["password"])
      .subscribe((data) => {
        if (data.length > 0) {
          this.authenticationService.isLoggedIn = true;
          this.userService.selectedUser = {
            id: data[0].payload.doc.id,
            data: data[0].payload.doc.data(),
          };
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
          this.router.navigate(["/dashboard"]);
        } else {
          this.snackBar.open("Invalid Credentials", "", {
            duration: 2000,
          });
          this.loading = false;
        }
      });
  }
}
