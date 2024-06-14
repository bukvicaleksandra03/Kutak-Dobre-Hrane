import { Component, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
  selector: 'app-all-restaurants',
  templateUrl: './all-restaurants.component.html',
  styleUrls: ['./all-restaurants.component.css'],
})
export class AllRestaurantsComponent implements OnInit {
  constructor(private restaurantsService: RestaurantsService) {}

  allRestaurants: Restaurant[] = [];

  ngOnInit(): void {
    this.restaurantsService.getAll().subscribe((restaurants: Restaurant[]) => {
      this.allRestaurants = restaurants;
    });
  }
}
