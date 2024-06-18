import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import {
  checkAllFields,
  checkCreditCard,
  checkEmail,
  checkPassword,
  checkPhone,
} from 'src/app/userValidationFuncs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private servis: UserService, private router: Router) {}

  user: User = new User();
  prof_picture: File;
  message: string;

  register() {
    this.user.type = 'guest';

    if (checkAllFields(this.user) != 'ok') {
      this.message = checkAllFields(this.user);
      return;
    }
    if (checkPassword(this.user.password) != 'ok') {
      this.message = checkPassword(this.user.password);
      return;
    }
    if (checkEmail(this.user.email) != 'ok') {
      this.message = checkEmail(this.user.email);
      return;
    }
    if (checkCreditCard(this.user.credit_card) != 'ok') {
      this.message = checkCreditCard(this.user.credit_card);
      return;
    }
    if (checkPhone(this.user.phone) != 'ok') {
      this.message = checkPhone(this.user.phone);
      return;
    }

    this.user.active = 'pending';
    this.user.didnt_show_cnt = 0;
    this.user.restaurant = '';
    if (this.prof_picture == null) {
      this.user.profile_picture = 'generic_user.jpg';
      this.servis.register(this.user).subscribe((resp) => {
        if (resp['message'] == 'ok') {
          alert(
            'You have successfully registered. After the administrator approves the request, you will be able to log in.'
          );
          this.router.navigate(['/home']);
        } else alert(resp['message']);
      });
    } else {
      this.servis.upload(this.prof_picture).subscribe((resp) => {
        if (resp['message'] == 'ok') {
          this.user.profile_picture = resp['filename'];
          this.servis.register(this.user).subscribe((resp) => {
            if (resp['message'] == 'ok') {
              alert(
                'You have successfully registered. After the administrator approves the request, you will be able to log in.'
              );
              this.router.navigate(['/home']);
            } else alert(resp['message']);
          });
        } else {
          alert(resp['message']);
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
}
