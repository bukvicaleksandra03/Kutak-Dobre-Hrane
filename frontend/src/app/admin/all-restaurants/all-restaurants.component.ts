import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
  selector: 'app-all-restaurants',
  templateUrl: './all-restaurants.component.html',
  styleUrls: ['./all-restaurants.component.css'],
})
export class AllRestaurantsComponent implements OnInit {
  constructor(private restaurantsService: RestaurantsService, private router: Router) {}

  allRestaurants: Restaurant[] = [];

  ngOnInit(): void {
    this.restaurantsService.getAll().subscribe((restaurants: Restaurant[]) => {
      this.allRestaurants = restaurants;
    });
  }

  onLinkClick(event: Event, restaurant: Restaurant): void {
    event.preventDefault();
    localStorage.setItem('chosenRestaurant', JSON.stringify(restaurant));
    this.router.navigate(['admin/add-meal']);
  }
}
