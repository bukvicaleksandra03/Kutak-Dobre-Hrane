import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/models/reservation';
import { User } from 'src/app/models/user';
import { ReservationsService } from 'src/app/services/reservations.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-guest-reservations',
  templateUrl: './guest-reservations.component.html',
  styleUrls: ['./guest-reservations.component.css'],
})
export class GuestReservationsComponent implements OnInit {
  allReservations: Reservation[] = [];
  passedReservations: Reservation[] = [];
  canceledReservations: Reservation[] = [];
  haventShowedReservations: Reservation[] = [];
  // reservations which have passed and which we have commented on
  archiveReservations: Reservation[] = [];
  currentReservations: Reservation[] = [];
  user: User = new User();

  errorMsgPassed: string = '';

  constructor(
    private reservationService: ReservationsService,
    private restaurantService: RestaurantsService,
    private usersService: UserService
  ) {}

  ngOnInit(): void {
    this.allReservations = [];
    this.passedReservations = [];
    this.canceledReservations = [];
    this.haventShowedReservations = [];
    this.archiveReservations = [];
    this.currentReservations = [];

    this.usersService.getUserProfile().subscribe((user) => {
      this.user = user;

      this.reservationService.getAllOfUsersReservations(this.user._id).subscribe((reservations) => {
        this.allReservations = reservations;
        this.fetchNamesOfRestaurants(this.allReservations);

        this.allReservations.forEach((reservation) => {
          if (
            reservation.status == 'pending' ||
            reservation.status == 'declined' ||
            reservation.status == 'accepted'
          ) {
            this.currentReservations.push(reservation);
          } else if (reservation.status == 'canceled') {
            this.canceledReservations.push(reservation);
          } else if (reservation.status == 'finished' && reservation.showed_up == false) {
            this.haventShowedReservations.push(reservation);
          } else if (
            reservation.status == 'finished' &&
            reservation.showed_up == true &&
            reservation.rating == -1
          ) {
            this.passedReservations.push(reservation);
          } else {
            this.archiveReservations.push(reservation);
          }
        });

        this.currentReservations.sort((res1, res2) => {
          const date1 = new Date(res1.datetime_start);
          const date2 = new Date(res2.datetime_start);
          return date1.getTime() - date2.getTime();
        });

        this.haventShowedReservations.sort((res1, res2) => {
          const date1 = new Date(res1.datetime_start);
          const date2 = new Date(res2.datetime_start);
          return date2.getTime() - date1.getTime();
        });

        this.archiveReservations.sort((res1, res2) => {
          const date1 = new Date(res1.datetime_start);
          const date2 = new Date(res2.datetime_start);
          return date2.getTime() - date1.getTime();
        });
      });
    });
  }

  onRateChange(newRating: number, reservation: Reservation): void {
    reservation.rating = newRating;
  }

  fetchNamesOfRestaurants(reservations: Reservation[]) {
    reservations.forEach((reservation) => {
      this.restaurantService.getRestaurantById(reservation.restaurant).subscribe((restaurant) => {
        reservation.restaurantName = restaurant.name;
      });
    });
  }

  submitRating(reservation: Reservation) {
    this.errorMsgPassed = '';
    if (reservation.comment == '') {
      this.errorMsgPassed = 'You must comment first';
      return;
    }

    this.reservationService
      .addCommentAndRating(reservation._id, reservation.comment, reservation.rating)
      .subscribe((reservation: Reservation) => {
        this.restaurantService
          .updateAvgRating(reservation.restaurant, reservation.rating)
          .subscribe((resp) => {
            if (resp) {
              this.ngOnInit();
            }
          });
      });
  }

  cancelReservation(reservation: Reservation) {
    this.reservationService.cancelReservation(reservation._id).subscribe((resp) => {
      if (resp) {
        this.ngOnInit();
      }
    });
  }

  isAtLeast45MinutesBefore(date: Date) {
    const time1 = new Date(date).getTime();
    const now = new Date().getTime();

    // Calculate the difference in milliseconds
    const difference = now - time1;

    // Check if the difference is at least 45 minutes (45 * 60 * 1000 milliseconds)
    return difference >= 45 * 60 * 1000;
  }
}
