import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';
import {
  checkAllFields,
  checkPassword,
  checkEmail,
  checkPhone,
} from 'src/app/userValidationFuncs';

@Component({
  selector: 'app-new-waiter',
  templateUrl: './new-waiter.component.html',
  styleUrls: ['./new-waiter.component.css'],
})
export class NewWaiterComponent implements OnInit {
  newWaiter: User = new User();
  message: string = '';
  prof_picture: File;
  restaurants: Restaurant[];
  nameOfRestaurant: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private restaurantServis: RestaurantsService
  ) {}

  ngOnInit(): void {
    this.restaurantServis.getAll().subscribe((resp) => {
      if (resp['message'] === 'ok') {
        this.restaurants = resp['restaurants'];
      } else {
        console.log(resp['message']);
      }
    });
  }

  registerWaiter() {
    this.message = '';
    this.newWaiter.type = 'waiter';
    if (checkAllFields(this.newWaiter) != 'ok') {
      this.message = checkAllFields(this.newWaiter);
      return;
    }
    if (checkPassword(this.newWaiter.password) != 'ok') {
      this.message = checkPassword(this.newWaiter.password);
      return;
    }
    if (checkEmail(this.newWaiter.email) != 'ok') {
      this.message = checkEmail(this.newWaiter.email);
      return;
    }
    if (checkPhone(this.newWaiter.phone) != 'ok') {
      this.message = checkPhone(this.newWaiter.phone);
      return;
    }

    if (this.nameOfRestaurant == '') {
      this.message = 'You must choose a restaurant';
      return;
    }

    this.newWaiter.active = 'active';
    this.newWaiter.restaurant = this.nameOfRestaurant;
    this.newWaiter.credit_card = '';
    if (this.prof_picture == null) {
      this.newWaiter.profile_picture = 'generic_user.jpg';
      this.userService.register(this.newWaiter).subscribe((resp) => {
        if (resp['message'] == 'ok') {
          alert('Waiter successfully added.');
          this.router.navigate(['admin/users-overview']);
        } else alert(resp['message']);
      });
    } else {
      this.userService.upload(this.prof_picture).subscribe((resp) => {
        if (resp['message'] == 'ok') {
          this.newWaiter.profile_picture = resp['filename'];
          this.userService.register(this.newWaiter).subscribe((resp) => {
            if (resp['message'] == 'ok') {
              alert('Waiter successfully added.');
              this.router.navigate(['admin/users-overview']);
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
      return new Error('Allowed formats are .jpg, .jpeg and .png');
    }
    const image = new Image();
    image.src = URL.createObjectURL(slika);
    image.onload = () => {
      if (
        image.height < 100 ||
        image.height > 300 ||
        image.width < 100 ||
        image.height > 300
      ) {
        this.message =
          'Picture must have dimensions between 100x100 and 300x300';
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
