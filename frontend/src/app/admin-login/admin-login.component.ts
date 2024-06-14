import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  constructor( private userService: UserService, private router: Router) {}


  user: User = new User();

  username: string;
  password: string;

  message: string;

  login() {
    this.userService.login(this.username, this.password).subscribe((resp)=>{
      if (resp['message'] === "ok") {
        this.user = resp['user'];
        if (this.user.type === "admin") {
          this.router.navigate(['../admin/users-overview']);
        } else {
          this.message = resp['message'];
        }
      }
      else this.message = resp['message'];
    })
  }
}
