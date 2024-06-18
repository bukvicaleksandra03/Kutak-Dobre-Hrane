import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Delivery } from 'src/app/models/delivery';
import { Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-waiter-deliveries',
  templateUrl: './waiter-deliveries.component.html',
  styleUrls: ['./waiter-deliveries.component.css'],
})
export class WaiterDeliveriesComponent implements OnInit {
  loggedWaiter: User = new User();
  pendingDeliveries: Delivery[] = [];
  restaurant: Restaurant = new Restaurant();

  constructor(
    private deliveriesService: DeliveriesService,
    private restaurantsService: RestaurantsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.pendingDeliveries = [];

    this.userService.getUserProfile().subscribe((user) => {
      this.loggedWaiter = user;

      this.restaurantsService.getRestaurantById(this.loggedWaiter.restaurant).subscribe((restaurant) => {
        this.restaurant = restaurant;

        this.deliveriesService
          .getRestaurantPendingDeliveries(this.loggedWaiter.restaurant)
          .subscribe((deliveries) => {
            this.pendingDeliveries = deliveries;

            this.pendingDeliveries.sort((delivery1, delivery2) => {
              const date1 = new Date(delivery1.date);
              const date2 = new Date(delivery2.date);
              return date1.getTime() - date2.getTime();
            });

            this.pendingDeliveries.forEach((delivery) => {
              delivery.items.forEach((item) => {
                this.restaurant.meals.forEach((meal) => {
                  if (meal._id == item.meal) {
                    item.mealObj = meal;
                  }
                });
              });
              delivery.itemsString = this.turnItemsToString(delivery);
            });

            this.pendingDeliveries.forEach((delivery) => {
              this.deliveriesService.getEstimatedTimeTraffic(delivery._id).subscribe((resp) => {
                delivery.estimated_delivery_mins = Math.ceil(resp);
              });
            });
          });
      });
    });
  }

  turnItemsToString(delivery: Delivery) {
    let ret = '';
    delivery.items.forEach((item) => {
      if (ret != '') ret += ', ';
      ret += item.quantity.toString();
      ret += 'x';
      ret += item.mealObj.name;
    });
    return ret;
  }

  accept(delivery: Delivery) {
    this.deliveriesService
      .acceptDelivery(delivery._id, delivery.estimated_delivery_mins)
      .subscribe((resp) => {
        this.ngOnInit();
      });
  }

  decline(delivery: Delivery) {
    this.deliveriesService.declineDelivery(delivery._id).subscribe((resp) => {
      this.ngOnInit();
    });
  }
}
