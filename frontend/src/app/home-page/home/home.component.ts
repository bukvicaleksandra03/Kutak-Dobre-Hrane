import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs';
import { Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { ReservationsService } from 'src/app/services/reservations.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private restourantService: RestaurantsService,
    private usersService: UserService,
    private reservationsService: ReservationsService
  ) {}

  restaurantsNum: number;
  numOfRegisteredGuests: number;
  numOfReservations24h: number;
  numOfReservationsWeek: number;
  numOfReservationsMonth: number;
  fittingRestaurants: Restaurant[];
  allRestaurants: Restaurant[];

  searchName: string = '';
  searchAddress: string = '';
  searchType: string = '';

  ngOnInit(): void {
    this.usersService.getAllUsers().subscribe((resp) => {
      if (resp['message'] == 'ok') {
        this.numOfRegisteredGuests = resp['users'].filter(
          (user: User) => user.active === 'active' && user.type === 'guest'
        ).length;
      } else console.log(resp['message']);
    });

    this.restourantService.getAll().subscribe((restaurants: Restaurant[]) => {
      this.allRestaurants = restaurants;
      this.restaurantsNum = this.allRestaurants.length;
      this.allRestaurants.forEach((restaurant) => {
        this.usersService.getWaitersForRestaurant(restaurant).subscribe((res) => {
          if (res['message'] == 'ok') {
            restaurant.waiters = res['waiters'];
          } else console.log(res['message']);
        });
      });
      this.fittingRestaurants = this.allRestaurants;
    });

    this.numOfReservations24h = this.numOfReservationsWeek = this.numOfReservationsMonth = 0;
    this.reservationsService.getAll().subscribe((reservations) => {
      reservations.forEach((reservation) => {
        let now = new Date();
        let twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        if (new Date(reservation.created_at) > twentyFourHoursAgo) {
          this.numOfReservations24h += 1;
        }
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (new Date(reservation.created_at) > oneWeekAgo) {
          this.numOfReservationsWeek += 1;
        }
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        if (new Date(reservation.created_at) > oneMonthAgo) {
          this.numOfReservationsMonth += 1;
        }
      });
    });
  }

  sortAscName() {
    this.fittingRestaurants.sort((a, b) => a.name.localeCompare(b.name));
  }
  sortDescName() {
    this.fittingRestaurants.sort((a, b) => b.name.localeCompare(a.name));
  }
  sortAscAddress() {
    this.fittingRestaurants.sort((a, b) => a.address.localeCompare(b.address));
  }
  sortDescAddress() {
    this.fittingRestaurants.sort((a, b) => b.address.localeCompare(a.address));
  }
  sortAscType() {
    this.fittingRestaurants.sort((a, b) => a.type.localeCompare(b.type));
  }
  sortDescType() {
    this.fittingRestaurants.sort((a, b) => b.type.localeCompare(a.type));
  }

  filter() {
    this.fittingRestaurants = this.allRestaurants;
    if (this.searchName != '') {
      this.fittingRestaurants = this.fittingRestaurants.filter((restaurant) =>
        restaurant.name.includes(this.searchName)
      );
      this.searchName == '';
    }
    if (this.searchAddress != '') {
      this.fittingRestaurants = this.fittingRestaurants.filter((restaurant) =>
        restaurant.address.includes(this.searchAddress)
      );
      this.searchAddress == '';
    }
    if (this.searchType != '') {
      this.fittingRestaurants = this.fittingRestaurants.filter((restaurant) =>
        restaurant.type.includes(this.searchType)
      );
      this.searchType == '';
    }
  }

  resetFilters() {
    this.fittingRestaurants = this.allRestaurants;
    this.searchName = '';
    this.searchAddress = '';
    this.searchType = '';
  }
}
