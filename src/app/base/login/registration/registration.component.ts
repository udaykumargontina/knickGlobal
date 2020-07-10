import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { AuthenticationService } from "../authentication-service/authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../models/user";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  throwMatDialogContentAlreadyAttachedError,
  MatSnackBar,
} from "@angular/material";
import { UserService } from "../user-service/user.service";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"]
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  confirmPasswordNotMatched = false;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public userService: UserService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {
    if (this.userService.selectedUser && this.userService.selectedUser.data) {
       this.userService.selectedUser.data['confirmPassword'] = this.userService.selectedUser.data['password'];
    }
    this.authenticationService.isRegistrationPage = true;
    this.registrationForm = this.formBuilder.group(
      {
        firstName: new FormControl(
          "",
          Validators.compose([Validators.required])
        ),
        lastName: new FormControl(""),
        email: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-z]{2,3}$/),
            Validators.minLength(4),
            Validators.maxLength(30),
          ])
        ),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(15),
          ])
        ),
        confirmPassword: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(15),
          ])
        ),
      },
      {
        validators: this.password.bind(this),
      }
    );
  }

  ngOnInit() {}

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get("password");
    const { value: confirmPassword } = formGroup.get("confirmPassword");
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  onKeyUp(event) {
      this.confirmPasswordNotMatched = false;
      if (
        this.registrationForm.value["password"] !==
        this.registrationForm.value["confirmPassword"]
      ) {
        this.confirmPasswordNotMatched = true;
      }
  }

  registrationClicked() {
    if (this.registrationForm.invalid) {
      return;
    }
    const data = this.registrationForm.value;
    delete data["confirmPassword"];
    if (this.userService.selectedUser.id === "") {
      this.userService
        .checkEmailAlreadyExists(data.email)
        .subscribe((result) => {
          if (result.length > 0) {
            this.snackBar.open("Email is Already Taken", "", {
              duration: 2000,
            });
          } else {
            this.userService.saveUser(data).then((result) => {
              this.snackBar.open("User Saved Successfully", "", {
                duration: 2000,
              });
              this.registrationForm.reset();
              this.router.navigate(["/login"]);
            });
          }
        });
    } else {
      this.userService.updateUser(data).then((result) => {
        this.snackBar.open("User Updatded Successfully", "", {
          duration: 2000,
        });
        this.registrationForm.reset();
        this.router.navigate(["/dashboard"]);
      });
    }
  }

  canDeactivate() {
    this.registrationForm.reset();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.authenticationService.isRegistrationPage = false;
  }
}
