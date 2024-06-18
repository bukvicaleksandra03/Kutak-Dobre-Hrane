import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.css'],
})
export class RestaurantInfoComponent implements OnInit {
  restaurant: Restaurant;
  loggedUser: User;
  selectedTab: string = '';
  mapSrc: SafeResourceUrl;

  constructor(private usersService: UserService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    let restaurantLS = localStorage.getItem('chosenRestaurant');
    if (restaurantLS != null) {
      this.restaurant = JSON.parse(restaurantLS);

      const baseUrl =
        'https://www.google.com/maps/embed/v1/place?key=AIzaSyCYZsqZFh85MiL9eJqiuE_Mo5bl8378XmU&q=';
      const url = `${baseUrl}${encodeURIComponent(this.restaurant.address)}`;
      this.mapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      return;
    }

    this.usersService.getUserProfile().subscribe((user) => {
      this.loggedUser = user;
    });
  }
}
