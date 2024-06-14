import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Restaurant } from '../models/restaurant';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  uri: string = 'http://localhost:4000/users';

  upload(file: File) {
    let formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.uri}/upload`, formData);
  }

  login(username: string, password: string) {
    const data = {
      username: username,
      password: password,
    };
    return this.http.post(`${this.uri}/login`, data);
  }

  register(user: User) {
    return this.http.post(`${this.uri}/register`, user);
  }

  getAllUsers() {
    return this.http.get(`${this.uri}/all`);
  }

  getAllPendingGuests() {
    return this.http.get(`${this.uri}/getAllPendingGuests`);
  }

  getUsername(user_id: string) {
    return this.http.get<string>(`${this.uri}/getUsername/${user_id}`);
  }

  changePassword(username: string, newPassword: string) {
    return this.http.put(`${this.uri}/changePassword`, {
      username: username,
      newPassword: newPassword,
    });
  }

  deactivateUser(user: User) {
    return this.http.put(`${this.uri}/deactivateUser`, { id: user._id });
  }

  activateUser(user: User) {
    return this.http.put(`${this.uri}/activateUser`, { id: user._id });
  }

  unblockGuest(user: User) {
    return this.http.put(`${this.uri}/unblockGuest`, { id: user._id });
  }

  declineUser(user: User) {
    return this.http.put(`${this.uri}/declineUser`, { id: user._id });
  }

  deleteUser(user: User) {
    return this.http.put(`${this.uri}/deleteUser`, { username: user.username });
  }

  updateUser(user: User) {
    return this.http.put(`${this.uri}/updateUser`, user);
  }

  getSafetyQuestion(username: string) {
    return this.http.put(`${this.uri}/getSafetyQuestion`, {
      username: username,
    });
  }

  checkSafetyAnswer(username: string, safetyAnswer: string) {
    return this.http.put(`${this.uri}/checkSafetyAnswer`, {
      username: username,
      safetyAnswer: safetyAnswer,
    });
  }

  getWaitersForRestaurant(restaurant: Restaurant) {
    const httpParams = new HttpParams().set('restaurantId', restaurant._id);

    return this.http.get(`${this.uri}/waitersForRestaurant`, {
      params: httpParams,
    });
  }

  increaseDidntShowCnt(user_id: string) {
    return this.http.put(`${this.uri}/increaseDidntShowCnt`, {
      user_id: user_id,
    });
  }
}
