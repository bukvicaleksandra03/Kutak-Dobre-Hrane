import { Component, OnInit } from '@angular/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Delivery } from 'src/app/models/delivery';
import { Meal, Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order-food',
  templateUrl: './order-food.component.html',
  styleUrls: ['./order-food.component.css'],
})
export class OrderFoodComponent implements OnInit {
  restaurant: Restaurant;
  meals: Meal[] = [];
  delivery: Delivery = new Delivery();
  loggedUser: User = new User();

  constructor(private usersService: UserService, private deliveriesService: DeliveriesService) {}

  ngOnInit(): void {
    let restaurantLS = localStorage.getItem('chosenRestaurant');
    if (restaurantLS != null) {
      this.restaurant = JSON.parse(restaurantLS);
    } else {
      return;
    }

    this.usersService.getUserProfile().subscribe((user) => {
      this.loggedUser = user;

      this.deliveriesService
        .getUnorderedDelivery(this.loggedUser._id, this.restaurant._id)
        .subscribe((delivery) => {
          if (delivery) {
            this.delivery = delivery;
          } else {
            this.delivery = new Delivery();
            this.delivery.total_price = 0;
            this.delivery.items = [];
            this.delivery.user = this.loggedUser._id;
            this.delivery.restaurant = this.restaurant._id;
          }
        });
    });

    this.meals = this.restaurant.meals;
    this.meals.forEach((meal) => {
      meal.quantity = 1;
    });
  }

  updateQuantity(meal: any, increment: number) {
    meal.quantity = Math.max(1, meal.quantity + increment);
  }

  addToCart(meal: Meal) {
    let alreadyInCart = false;
    this.delivery.items.forEach((item) => {
      if (item.meal == meal._id) {
        item.quantity += meal.quantity;
        alreadyInCart = true;
      }
    });

    if (!alreadyInCart) {
      this.delivery.items.push({
        meal: meal._id,
        quantity: meal.quantity,
        mealObj: null,
      });
    }

    this.delivery.total_price += meal.quantity * meal.price;
    if (this.delivery._id == '' || this.delivery._id == undefined) {
      this.deliveriesService.createNew(this.delivery).subscribe((delivery) => {
        this.delivery = delivery;
        alert('Succesfully added to cart');
      });
    } else {
      this.deliveriesService
        .updateItems(this.delivery._id, this.delivery.items, this.delivery.total_price)
        .subscribe((delivery) => {
          this.delivery = delivery;
          alert('Succesfully added to cart');
        });
    }
  }
}
