import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meal, Restaurant } from '../models/restaurant';
import { retryWhen } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  constructor(private http: HttpClient) {}
  uri: string = 'http://localhost:4000/restaurants';

  addNew(restaurant: Restaurant) {
    return this.http.post(`${this.uri}/addNew`, restaurant);
  }

  getAll() {
    return this.http.get<Restaurant[]>(`${this.uri}/getAll`);
  }

  addNewMeal(restaurant_id: string, meal: Meal) {
    const data = {
      restaurant_id: restaurant_id,
      meal: meal,
    };
    return this.http.post<Meal>(`${this.uri}/addNewMeal`, data);
  }

  getRestaurantById(restaurant_id: string) {
    return this.http.get<Restaurant>(`${this.uri}/getRestaurant/${restaurant_id}`);
  }

  updateAvgRating(restaurant_id: string, rating: number) {
    return this.http.put(`${this.uri}/updateAvgRating`, {
      restaurant_id: restaurant_id,
      rating: rating,
    });
  }

  getMeals(restaurant_id: string) {
    return this.http.get<Meal[]>(`${this.uri}/getMeals/${restaurant_id}`);
  }
}
