import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-guest-restaurants',
  templateUrl: './guest-restaurants.component.html',
  styleUrls: ['./guest-restaurants.component.css'],
})
export class GuestRestaurantsComponent implements OnInit {
  fittingRestaurants: Restaurant[];
  allRestaurants: Restaurant[];

  searchName: string = '';
  searchAddress: string = '';
  searchType: string = '';

  constructor(
    private router: Router,
    private restourantService: RestaurantsService,
    private usersService: UserService
  ) {}

  ngOnInit(): void {
    this.restourantService.getAll().subscribe((restaurants: Restaurant[]) => {
      this.allRestaurants = restaurants;
      this.allRestaurants.forEach((restaurant) => {
        this.usersService.getWaitersForRestaurant(restaurant).subscribe((res) => {
          if (res['message'] == 'ok') {
            restaurant.waiters = res['waiters'];
          } else console.log(res['message']);
        });
      });
      this.fittingRestaurants = this.allRestaurants;
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

  onLinkClick(event: Event, restaurant: Restaurant): void {
    event.preventDefault();
    localStorage.setItem('chosenRestaurant', JSON.stringify(restaurant));
    this.router.navigate(['guest/restaurant-info']);
  }
}
