import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Table } from '../models/layout';
import { Reservation } from '../models/reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}
  uri: string = 'http://localhost:4000/reservations';

  newReservation(
    restaurant_id: string,
    selected_table_id: string,
    loggedUser_id: string,
    start: Date,
    end: Date,
    additionalReq: string,
    numOfPeople: number
  ) {
    const data = {
      restaurant: restaurant_id,
      table: selected_table_id,
      user: loggedUser_id,
      datetime_start: encodeURIComponent(start.toISOString()),
      datetime_end: encodeURIComponent(end.toISOString()),
      additional_requirements: additionalReq,
      number_of_people: numOfPeople,
    };

    return this.http.post<Reservation>(`${this.uri}/newReservation`, data);
  }

  getAllComments(restaurant_id: string) {
    return this.http.get<Reservation[]>(`${this.uri}/getAllComments/${restaurant_id}`);
  }

  // valid reservations are those that are accepted or ongoing (finished + showed_up = true)
  getValidReservationsInTimeframe(restaurant_id: string, datetime_start: Date, datetime_end: Date) {
    const start = encodeURIComponent(new Date(datetime_start).toISOString());
    const end = encodeURIComponent(new Date(datetime_end).toISOString());

    return this.http.get<Reservation[]>(
      `${this.uri}/getValidReservationsInTimeframe/${restaurant_id}/${start}/${end}`
    );
  }

  getPendingReservations(restaurant_id: string) {
    return this.http.get<Reservation[]>(`${this.uri}/getPendingReservations/${restaurant_id}`);
  }

  getAcceptedReservations(restaurant_id: string) {
    return this.http.get<Reservation[]>(`${this.uri}/getAcceptedReservations/${restaurant_id}`);
  }

  getCurrentlyHereReservations(restaurant_id: string) {
    return this.http.get<Reservation[]>(`${this.uri}/getCurrentlyHereReservations/${restaurant_id}`);
  }

  acceptReservation(reservation_id: string, waiter_id: string, table_id: string) {
    const data = {
      _id: reservation_id,
      waiter: waiter_id,
      table: table_id,
    };
    return this.http.put<Reservation>(`${this.uri}/acceptReservation`, data);
  }

  declineReservation(reservation_id: string, waiter_id: string, declined_comment: string) {
    const data = {
      _id: reservation_id,
      waiter: waiter_id,
      declined_comment: declined_comment,
    };
    return this.http.put<Reservation>(`${this.uri}/declineReservation`, data);
  }

  cancelReservation(reservation_id: string) {
    return this.http.put<Reservation>(`${this.uri}/cancelReservation`, {
      reservation_id: reservation_id,
    });
  }

  setFinished(reservation_id: string, showed_up: boolean) {
    const data = { reservation_id: reservation_id, showed_up: showed_up };
    return this.http.put<Reservation>(`${this.uri}/setFinished`, data);
  }

  increaseTime(reservation_id: string) {
    return this.http.put<Reservation>(`${this.uri}/increaseTime`, {
      reservation_id: reservation_id,
    });
  }

  getAllOfUsersReservations(user_id: string) {
    return this.http.get<Reservation[]>(`${this.uri}/getAllOfUsersReservations/${user_id}`);
  }

  addCommentAndRating(reservation_id: string, comment: string, rating: number) {
    const data = {
      reservation_id: reservation_id,
      comment: comment,
      rating: rating,
    };
    return this.http.put<Reservation>(`${this.uri}/addCommentAndRating`, data);
  }

  getAll() {
    return this.http.get<Reservation[]>(`${this.uri}/getAll`);
  }

  getWaitersReservations(waiter_id: string) {
    return this.http.get<Reservation[]>(`${this.uri}/getWaitersReservations/${waiter_id}`);
  }
}
