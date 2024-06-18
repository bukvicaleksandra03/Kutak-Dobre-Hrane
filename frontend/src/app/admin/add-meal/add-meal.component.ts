import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meal, Restaurant } from 'src/app/models/restaurant';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.css'],
})
export class AddMealComponent implements OnInit {
  restaurant: Restaurant = new Restaurant();
  newMeal: Meal = new Meal();
  message: string = '';
  image: File;

  constructor(
    private usersService: UserService,
    private restaurantsService: RestaurantsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let restaurantLS = localStorage.getItem('chosenRestaurant');
    if (!restaurantLS) return;
    this.restaurant = JSON.parse(restaurantLS);
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
        this.image = null;
      } else {
        this.message = '';
        this.image = slika;
        return slika;
      }
    };
    return null;
  }

  submit() {
    if (this.newMeal.name == '' || this.newMeal.ingredients == '' || this.newMeal.price == 0) {
      this.message = 'You must fill all fields';
      return;
    }
    if (this.image == null || this.image == undefined) {
      this.message = 'You must enter a picture';
      return;
    }

    this.usersService.upload(this.image).subscribe((resp) => {
      if (resp['message'] == 'ok') {
        this.newMeal.picture = resp['filename'];
        this.restaurantsService.addNewMeal(this.restaurant._id, this.newMeal).subscribe((meal) => {
          if (meal) {
            localStorage.removeItem('chosenRestaurant');
            this.router.navigate(['admin/all-restaurants']);
          }
        });
      }
    });
  }
}
