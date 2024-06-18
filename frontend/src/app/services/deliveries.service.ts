import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Delivery, Item } from '../models/delivery';

@Injectable({
  providedIn: 'root',
})
export class DeliveriesService {
  constructor(private http: HttpClient) {}
  uri: string = 'http://localhost:4000/deliveries';

  getUnorderedDelivery(user_id: string, restaurant_id: string) {
    return this.http.get<Delivery>(`${this.uri}/getUnorderedDelivery/${user_id}/${restaurant_id}`);
  }

  createNew(delivery: Delivery) {
    const data = {
      delivery: delivery,
    };
    return this.http.post<Delivery>(`${this.uri}/createNew`, data);
  }

  updateItems(delivery_id: string, items: Item[], total_price: number) {
    const data = {
      delivery_id: delivery_id,
      items: items,
      total_price: total_price,
    };
    return this.http.post<Delivery>(`${this.uri}/updateItems`, data);
  }

  order(delivery_id: string) {
    const data = {
      delivery_id: delivery_id,
    };
    return this.http.post<Delivery>(`${this.uri}/order`, data);
  }

  deleteDelivery(delivery_id: string) {
    const data = {
      delivery_id: delivery_id,
    };
    return this.http.post<Delivery>(`${this.uri}/deleteDelivery`, data);
  }

  getAllOfUsersDeliveries(user_id: string) {
    return this.http.get<Delivery[]>(`${this.uri}/getAllOfUsersDeliveries/${user_id}`);
  }

  getRestaurantPendingDeliveries(restaurant_id: string) {
    return this.http.get<Delivery[]>(`${this.uri}/getRestaurantPendingDeliveries/${restaurant_id}`);
  }

  archiveDelivery(delivery_id: string) {
    return this.http.get(`${this.uri}/archiveDelivery/${delivery_id}`);
  }

  getEstimatedTimeTraffic(delivery_id: string) {
    return this.http.get<number>(`${this.uri}/getEstimatedTimeTraffic/${delivery_id}`);
  }

  acceptDelivery(delivery_id: string, estimated_time_mins: number) {
    const data = {
      delivery_id: delivery_id,
      estimated_time_mins: estimated_time_mins,
    };
    return this.http.post(`${this.uri}/acceptDelivery`, data);
  }

  declineDelivery(delivery_id: string) {
    const data = {
      delivery_id: delivery_id,
    };
    return this.http.post(`${this.uri}/declineDelivery`, data);
  }
}
