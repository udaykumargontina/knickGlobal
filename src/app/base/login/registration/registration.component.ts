import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import  * as bcrypt from 'bcryptjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
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
import { finalize } from 'rxjs/operators';

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"]
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  confirmPasswordNotMatched = false;
  imageData;
  imageSrc: string = "/assets/dummyuser.png";
  selectedImage: any = null;
  task: AngularFireUploadTask;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public userService: UserService,
    private snackBar: MatSnackBar,
    private fireStorage: AngularFireStorage,
    private authenticationService: AuthenticationService
  ) {
    if (this.userService.selectedUser && this.userService.selectedUser.data) {
       this.userService.selectedUser.data['confirmPassword'] = this.userService.selectedUser.data['password'];
      }
      this.imageSrc = this.userService.selectedUser.data['imageUrl'] !== "" ? this.userService.selectedUser.data['imageUrl'] : this.imageSrc;
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
          profilePic: new FormControl(""),
          password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5)
          ])
        ),
        confirmPassword: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5)
          ])
        ),
      },
      {
        validators: this.password.bind(this),
      }
    );
  }

  ngOnInit() {
  }

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

  chooseImage(event) {
    if (event.target.files && event.target.files[0]) {
      let reader= new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imageData = reader.result;
        this.selectedImage = event.target.files[0];
        this.imageSrc = this.imageData;
      }
    } else {
      this.imageSrc = "/assets/dummyuser.png";
      this.selectedImage = null;
    }
  }

  resetImage() {
    this.imageSrc = "/assets/dummyuser.png";
    this.selectedImage = null;
  }

  registrationClicked() {
    if (this.registrationForm.invalid) {
      return;
    }
    const data = this.registrationForm.value;
    delete data["confirmPassword"];
    let filePath;
    let fileRef;
    if(this.selectedImage) {
      filePath = `profilePictures/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      fileRef = this.fireStorage.ref(filePath);
    }

    delete data['profilePic'];
    data['imageUrl'] = this.imageSrc;

    bcrypt.hash(data['password'], 12).then(hashedPassword => {
      if (this.userService.selectedUser.id === "") {
        data['password'] = hashedPassword;
        this.userService
          .checkEmailAlreadyExists(data.email)
          .subscribe((result) => {
            if (result.length > 0) {
              this.snackBar.open("Email is Already Taken", "", {
                duration: 2000,
              });
            } else {
              if ( data['imageUrl'] !== "/assets/dummyuser.png") {
                this.fireStorage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
                  finalize(() => {
                    fileRef.getDownloadURL().subscribe((url) => {
                      data['imageUrl'] = url;
                      this.userService.saveUser(data).then((result) => {
                        this.snackBar.open("User saved successfully","", {
                          duration: 2000,
                        });
                        this.resetFormData();
                        this.router.navigate(["/login"]);
                      });
                    });
                  })
                ).subscribe();
              } else {
                this.userService.saveUser(data).then((result) => {
                  this.snackBar.open("User saved successfully","", {
                    duration: 2000,
                  });
                  this.resetFormData();
                  this.router.navigate(["/login"]);
                });
              }

            }
          });
      } else {
        if ( data['imageUrl'] !== "/assets/dummyuser.png" && this.userService.selectedUser.data.imageUrl !== data.imageUrl) {
          this.fireStorage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(url => {
                data['imageUrl'] = url;
                this.saveUser(data);
              });
            }
          )).subscribe();
        } else {
          this.saveUser(data);
        }
      }
    });
  }

  resetFormData() {
    this.registrationForm.reset();
    this.imageData = null;
    this.imageSrc = "/assets/dummyuser.png";
    this.selectedImage = null;
  }

  saveUser(data) {
    if (this.userService.selectedUser.data.password !== data.password) {
      bcrypt.hash(data.password, 12).then(hashedPwd => {
        data.password = hashedPwd;
        this.updateUser(data);
      });
    } else {
      this.updateUser(data);
    }
  }

  updateUser(data) {
    this.userService.updateUser(data).then((result) => {
      this.snackBar.open("User Updatded Successfully", "", {
        duration: 2000,
      });
      this.resetFormData();
      this.router.navigate(["/dashboard"]);
    });
  }

  canDeactivate() {
    this.registrationForm.reset();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.authenticationService.isRegistrationPage = false;
  }
}
