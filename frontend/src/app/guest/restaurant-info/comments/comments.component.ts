import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/models/reservation';
import { Restaurant } from 'src/app/models/restaurant';
import { ReservationsService } from 'src/app/services/reservations.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  restaurant: Restaurant;
  reservationsWithComments: Reservation[] = [];

  constructor(private reservationsService: ReservationsService, private usersService: UserService) {}

  ngOnInit(): void {
    let restaurantLS = localStorage.getItem('chosenRestaurant');
    if (restaurantLS != null) {
      this.restaurant = JSON.parse(restaurantLS);
    } else {
      return;
    }

    this.reservationsWithComments = [];
    this.reservationsService.getAllComments(this.restaurant._id).subscribe((reservations) => {
      if (reservations) {
        reservations.forEach((reservation) => {
          if (reservation.comment != '' || reservation.rating != -1) {
            this.usersService.getUsername(reservation.user).subscribe((username: string) => {
              reservation.username = username;
            });
            this.reservationsWithComments.push(reservation);
          }
        });
      }
    });
  }
}
