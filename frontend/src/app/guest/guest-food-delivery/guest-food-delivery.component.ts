import { Component, OnInit } from '@angular/core';
import { Delivery } from 'src/app/models/delivery';
import { User } from 'src/app/models/user';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-guest-food-delivery',
  templateUrl: './guest-food-delivery.component.html',
  styleUrls: ['./guest-food-delivery.component.css'],
})
export class GuestFoodDeliveryComponent implements OnInit {
  allDeliveries: Delivery[] = [];
  user: User = new User();

  currentDeliveries: Delivery[] = [];
  archiveDeliveries: Delivery[] = [];

  constructor(
    private deliveriesService: DeliveriesService,
    private restaurantService: RestaurantsService,
    private usersService: UserService
  ) {}

  ngOnInit(): void {
    this.allDeliveries = [];
    this.currentDeliveries = [];
    this.archiveDeliveries = [];

    this.usersService.getUserProfile().subscribe((user) => {
      this.user = user;

      this.deliveriesService.getAllOfUsersDeliveries(this.user._id).subscribe((deliveries) => {
        this.allDeliveries = deliveries;
        this.fetchNamesOfRestaurants(this.allDeliveries);

        this.allDeliveries.forEach((delivery) => {
          this.restaurantService.getRestaurantById(delivery.restaurant).subscribe((restaurant) => {
            delivery.items.forEach((item) => {
              restaurant.meals.forEach((meal) => {
                if (meal._id == item.meal) {
                  item.mealObj = meal;
                }
              });
            });
            delivery.itemsString = this.turnItemsToString(delivery);
          });
        });

        this.allDeliveries.forEach((delivery) => {
          if (delivery.status == 'archived' || delivery.status == 'declined') {
            this.archiveDeliveries.push(delivery);
          } else if (delivery.status != 'not_ordered') {
            this.currentDeliveries.push(delivery);
          }
        });

        this.archiveDeliveries.sort((delivery1, delivery2) => {
          const date1 = new Date(delivery1.date);
          const date2 = new Date(delivery2.date);
          return date2.getTime() - date1.getTime();
        });

        this.currentDeliveries.sort((delivery1, delivery2) => {
          const date1 = new Date(delivery1.date);
          const date2 = new Date(delivery2.date);
          return date2.getTime() - date1.getTime();
        });
      });
    });
  }

  fetchNamesOfRestaurants(deliveries: Delivery[]) {
    deliveries.forEach((delivery) => {
      this.restaurantService.getRestaurantById(delivery.restaurant).subscribe((restaurant) => {
        delivery.restaurantName = restaurant.name;
      });
    });
  }

  archiveDelivery(delivery) {
    this.deliveriesService.archiveDelivery(delivery._id).subscribe((resp) => {
      if (resp) this.ngOnInit();
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
}
