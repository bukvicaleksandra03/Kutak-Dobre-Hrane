import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation';
import { User } from 'src/app/models/user';
import { ReservationsService } from 'src/app/services/reservations.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-waiter-reservations',
  templateUrl: './waiter-reservations.component.html',
  styleUrls: ['./waiter-reservations.component.css'],
})
export class WaiterReservationsComponent implements OnInit {
  loggedWaiter: User = new User();

  pendingReservations: Reservation[] = [];
  allAcceptedReservations: Reservation[] = [];
  // ongong reservations are those of which users are supposed to be
  // in the restaurant currently
  ongoingReservations: Reservation[] = [];
  // all reservations that are ongoing and have been marked as showedup = true
  currentyHereReservations: Reservation[] = [];
  // accepted reservations are allAcceptedReservations without ongoingReservations
  acceptedReservations: Reservation[] = [];

  errorMessagePending: string = '';
  errorMessageOngoing: string = '';
  errorMessageCurrentyHere: string = '';
  errorMessageAccepted: string = '';

  constructor(
    private reservationsService: ReservationsService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe((user) => {
      this.loggedWaiter = user;

      this.pendingReservations = [];
      this.ongoingReservations = [];
      this.currentyHereReservations = [];
      this.acceptedReservations = [];

      this.reservationsService
        .getPendingReservations(this.loggedWaiter.restaurant)
        .subscribe((reservations) => {
          if (reservations) {
            this.pendingReservations = reservations;
            this.pendingReservations.forEach((reservation) => {
              this.userService.getUsername(reservation.user).subscribe((username) => {
                reservation.username = username;
              });
            });
          }
        });

      this.reservationsService
        .getAcceptedReservations(this.loggedWaiter.restaurant)
        .subscribe((reservations) => {
          if (reservations) {
            this.allAcceptedReservations = reservations;
            this.fetchUsernameForEachReservation(this.allAcceptedReservations);
            this.allAcceptedReservations.forEach((reservation) => {
              let date_now = new Date();
              if (
                new Date(reservation.datetime_start) <= date_now &&
                new Date(reservation.datetime_end) >= date_now
              ) {
                this.ongoingReservations.push(reservation);
              } else {
                this.acceptedReservations.push(reservation);
              }
            });

            this.acceptedReservations.sort((res1, res2) => {
              const date1 = new Date(res1.datetime_start);
              const date2 = new Date(res2.datetime_start);
              return date1.getTime() - date2.getTime();
            });
          }
        });

      this.reservationsService
        .getCurrentlyHereReservations(this.loggedWaiter.restaurant)
        .subscribe((reservations) => {
          this.currentyHereReservations = reservations;
          this.fetchUsernameForEachReservation(this.currentyHereReservations);
        });
    });
  }

  decline(reservation: Reservation) {
    if (reservation.declined_comment == '') {
      this.errorMessagePending = 'You must enter a comment why you declined a reservation.';
      return;
    }

    this.reservationsService
      .declineReservation(reservation._id, this.loggedWaiter._id, reservation.declined_comment)
      .subscribe((resp) => {
        if (resp) {
          this.ngOnInit();
        }
      });
  }

  viewSelectedTable(reservation: Reservation) {
    localStorage.setItem('reservation', JSON.stringify(reservation));
    this.router.navigate(['waiter/reservation-details']);
  }

  showedUp(reservation: Reservation) {
    this.reservationsService.setFinished(reservation._id, true).subscribe((resp) => {
      if (resp) {
        this.ngOnInit();
      }
    });
  }

  didntShowUp(reservation: Reservation) {
    this.reservationsService.setFinished(reservation._id, false).subscribe((resp) => {
      if (resp) {
        this.userService.increaseDidntShowCnt(reservation.user).subscribe((resp) => {
          if (resp) {
            this.ngOnInit();
          }
        });
      }
    });
  }

  increaseReservationTime(reservation: Reservation) {
    this.reservationsService.increaseTime(reservation._id).subscribe((resp) => {
      if (resp) {
        this.ngOnInit();
      }
    });
  }

  fetchUsernameForEachReservation(reservations: Reservation[]) {
    reservations.forEach((reservation) => {
      this.userService.getUsername(reservation.user).subscribe((username) => {
        reservation.username = username;
      });
    });
  }
}
