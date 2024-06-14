import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { checkPassword } from 'src/app/userValidationFuncs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private router: Router, private userService: UserService) {}

  user: User = new User();

  username: string;
  password: string;

  message: string;

  login() {
    this.userService.login(this.username, this.password).subscribe((resp) => {
      if (resp['message'] == 'ok') {
        if (this.user.type == 'admin') {
          this.message = 'Wrong password or username.';
          return;
        }
        this.user = resp['user'];
        localStorage.setItem('loggedUser', JSON.stringify(this.user));
        if (this.user.type == 'guest') {
          this.router.navigate(['/guest/profile']);
        } else if (this.user.type == 'waiter') {
          this.router.navigate(['/waiter/profile']);
        }
      } else this.message = resp['message'];
    });
  }

  changingPasswordstep1: boolean = false;
  changingPasswordstep2: boolean = false;
  changingPasswordstep3: boolean = false;
  safetyQuestion: string = '';
  safetyAnswer: string = '';
  message2: string;
  newPassword1: string;
  newPassword2: string;
  username2: string;

  forgottenPassword() {
    this.changingPasswordstep1 = true;
  }

  enterUsername() {
    this.userService.getSafetyQuestion(this.username2).subscribe((resp) => {
      if (resp['message'] == 'ok') {
        this.safetyQuestion = resp['question'];
        this.changingPasswordstep2 = true;
      } else {
        this.message2 = resp['message'];
      }
    });
  }

  enterSafetyAnswer() {
    this.userService.checkSafetyAnswer(this.username2, this.safetyAnswer).subscribe((resp) => {
      if (resp['message'] == 'ok') {
        this.changingPasswordstep3 = true;
      } else this.message2 = resp['message'];
    });
  }

  changePassword() {
    if (this.newPassword1 != this.newPassword2) {
      this.message2 = 'Passwords are not the same';
      return;
    }
    if (checkPassword(this.newPassword1) != 'ok') {
      this.message2 = checkPassword(this.newPassword1);
      return;
    }

    this.userService.changePassword(this.username2, this.newPassword1).subscribe((resp) => {
      if (resp['message'] == 'ok') {
        alert('Password successfully changed.');
        this.message2 = '';
        this.changingPasswordstep1 = false;
        this.changingPasswordstep2 = false;
        this.changingPasswordstep3 = false;
        this.newPassword1 = '';
        this.newPassword2 = '';
        this.safetyAnswer = '';
        this.safetyQuestion = '';
        this.username2 = '';
      } else this.message2 = resp['message'];
    });
  }
}
