import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Delivery, Item } from 'src/app/models/delivery';
import { Meal, Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent {
  restaurant: Restaurant;
  delivery: Delivery = new Delivery();
  loggedUser: User = new User();

  shoppingCartEmpty: Boolean = false;

  constructor(private usersService: UserService, private deliveriesService: DeliveriesService) {}

  ngOnInit(): void {
    let restaurantLS = localStorage.getItem('chosenRestaurant');
    if (restaurantLS != null) {
      this.restaurant = JSON.parse(restaurantLS);
    } else {
      return;
    }

    this.shoppingCartEmpty = false;

    this.usersService.getUserProfile().subscribe((user) => {
      this.loggedUser = user;

      this.deliveriesService
        .getUnorderedDelivery(this.loggedUser._id, this.restaurant._id)
        .subscribe((delivery) => {
          if (delivery) {
            this.delivery = delivery;
            this.delivery.items.forEach((item) => {
              this.restaurant.meals.forEach((meal) => {
                if (meal._id === item.meal) {
                  item.mealObj = meal;
                }
              });
            });
          } else {
            this.shoppingCartEmpty = true;
          }
        });
    });
  }

  updateQuantity(item: Item, increment: number) {
    if (item.quantity <= 1 && increment < 0) return;
    item.quantity = Math.max(1, item.quantity + increment);

    this.delivery.total_price += increment * item.mealObj.price;
    this.deliveriesService
      .updateItems(this.delivery._id, this.delivery.items, this.delivery.total_price)
      .subscribe();
  }

  removeFromCart(item: Item) {
    this.delivery.total_price -= item.mealObj.price * item.quantity;
    this.delivery.items = this.delivery.items.filter((i) => i !== item);

    if (this.delivery.items.length == 0) {
      this.shoppingCartEmpty = true;
      this.deliveriesService.deleteDelivery(this.delivery._id).subscribe((resp) => {
        this.ngOnInit();
      });
    } else {
      this.deliveriesService
        .updateItems(this.delivery._id, this.delivery.items, this.delivery.total_price)
        .subscribe();
    }
  }

  orderAll() {
    this.deliveriesService.order(this.delivery._id).subscribe((resp) => {
      if (resp) {
        alert('Successfully ordered, go to food delivery tab to see the status of the order');
        this.ngOnInit();
      }
    });
  }

  calculateColumnClass() {
    const itemCount = this.delivery.items.length;
    const columnSize = Math.ceil(12 / Math.min(itemCount, 4)); // Calculate the column size dynamically
    return `col-lg-${columnSize} col-md-${columnSize} mb-3`;
  }
}
