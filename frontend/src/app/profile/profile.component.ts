import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from '../services/user.service';
import { checkPassword } from '../userValidationFuncs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}
  user: User = new User();
  message: string;

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe((user) => {
      this.user = user;
    });
  }

  changeProfile() {
    if (this.user.type == 'guest') {
      this.router.navigate(['guest/change-profile']);
    } else if (this.user.type == 'waiter') {
      this.router.navigate(['waiter/change-profile']);
    }
  }

  changingPassword: boolean = false;
  oldPassword: string;
  newPassword1: string;
  newPassword2: string;

  startChanging() {
    this.changingPassword = true;
  }

  changePassword() {
    this.userService.login(this.user.username, this.oldPassword).subscribe((resp) => {
      if (resp['message'] == 'ok') {
        if (this.newPassword1 != this.newPassword2) {
          this.message = 'Passwords are not the same';
          return;
        }
        if (checkPassword(this.newPassword1) != 'ok') {
          this.message = checkPassword(this.newPassword1);
          return;
        }

        this.userService.changePassword(this.user.username, this.newPassword1).subscribe((resp) => {
          if (resp['message'] == 'ok') {
            alert('Password successfully changed.');
            this.message = '';
            this.oldPassword = '';
            this.newPassword1 = '';
            this.newPassword2 = '';
            this.changingPassword = false;
          } else this.message = resp['message'];
        });
      } else this.message = 'The previous password you entered is wrong';
    });
  }
}
