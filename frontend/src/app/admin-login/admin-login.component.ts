import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  constructor(private userService: UserService, private router: Router) {}

  user: User = new User();

  username: string;
  password: string;

  message: string;

  login() {
    this.userService.login(this.username, this.password).subscribe((resp) => {
      if (resp['message'] === 'ok') {
        localStorage.setItem('token', resp['token']);
        let userType = this.userService.getRole();
        if (userType !== 'admin') {
          localStorage.removeItem('token');
          this.message = 'Wrong password or username.';
          return;
        } else {
          this.router.navigate(['../admin/users-overview']);
        }
      } else this.message = resp['message'];
    });
  }
}
