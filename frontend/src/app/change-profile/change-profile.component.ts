import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { checkAllFields, checkCreditCard, checkEmail, checkPhone } from '../userValidationFuncs';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.css'],
})
export class ChangeProfileComponent implements OnInit {
  constructor(private router: Router, private userService: UserService, private location: Location) {}
  user: User = new User();
  prof_picture: File;
  message: string;

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe((user) => {
      this.user = user;
    });
  }

  change() {
    if (checkAllFields(this.user) != 'ok') {
      this.message = checkAllFields(this.user);
      return;
    }
    if (checkEmail(this.user.email) != 'ok') {
      this.message = checkEmail(this.user.email);
      return;
    }
    if (checkPhone(this.user.phone) != 'ok') {
      this.message = checkPhone(this.user.phone);
      return;
    }

    if (this.user.type == 'guest') {
      if (checkCreditCard(this.user.credit_card) != 'ok') {
        this.message = checkCreditCard(this.user.credit_card);
        return;
      }
    }
    console.log(this.user);
    if (this.prof_picture == null) {
      this.userService.updateUser(this.user).subscribe((resp) => {
        if (resp['message'] == 'ok') {
          alert('Successfully update profile.');

          this.goBack();
        } else {
          this.message = resp['message'];
        }
      });
    } else {
      this.userService.upload(this.prof_picture).subscribe((resp) => {
        if (resp['message'] == 'ok') {
          this.user.profile_picture = resp['filename'];
          this.userService.updateUser(this.user).subscribe((rest) => {
            if (resp['message'] == 'ok') {
              alert('Successfully update profile.');

              this.goBack();
            } else {
              this.message = resp['message'];
            }
          });
        } else {
          this.message = resp['message'];
        }
      });
    }
  }

  getFile(event) {
    const slika = event.target.files[0];
    const allowedTypes: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(slika.type)) {
      return new Error('Allowed formats are jpg, jpeg and png');
    }
    const image = new Image();
    image.src = URL.createObjectURL(slika);
    image.onload = () => {
      if (image.height < 100 || image.height > 300 || image.width < 100 || image.height > 300) {
        this.message = 'Picture must have dimensions between 100x100 and 300x300';
        this.prof_picture = null;
      } else {
        this.message = '';
        this.prof_picture = slika;
        return slika;
      }
    };
    return null;
  }

  goBack() {
    if (this.user.type == 'guest') {
      this.router.navigate(['guest/profile']);
    } else if (this.user.type == 'waiter') {
      this.router.navigate(['waiter/profile']);
    }
  }
}
