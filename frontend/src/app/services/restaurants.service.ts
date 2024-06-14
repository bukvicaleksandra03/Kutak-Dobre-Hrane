import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Restaurant } from '../models/restaurant';

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

  getRestaurantById(restaurant_id: string) {
    return this.http.get<Restaurant>(`${this.uri}/getRestaurant/${restaurant_id}`);
  }

  updateAvgRating(restaurant_id: string, rating: number) {
    return this.http.put(`${this.uri}/updateAvgRating`, {
      restaurant_id: restaurant_id,
      rating: rating,
    });
  }
}
