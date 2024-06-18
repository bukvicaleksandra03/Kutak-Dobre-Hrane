import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Reservation } from 'src/app/models/reservation';
import { Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import * as lf from 'src/app/layoutFuncs';
import { ReservationsService } from 'src/app/services/reservations.service';
import { Router } from '@angular/router';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css'],
})
export class ReservationDetailsComponent implements OnInit {
  reservation: Reservation;
  restaurant: Restaurant;
  loggedWaiter: User;

  reservationsInTimeframe: Reservation[] = [];

  myCanvas: HTMLCanvasElement;
  messageCanvas: string = '';
  @ViewChild('canvasElement') canvasRef: ElementRef<HTMLCanvasElement>;

  selectedTable: string = '';

  constructor(
    private userService: UserService,
    private reservationsService: ReservationsService,
    private restaurantService: RestaurantsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let reservationLS = localStorage.getItem('reservation');
    if (!reservationLS) return;
    this.reservation = JSON.parse(reservationLS);
    this.userService.getUserProfile().subscribe((user) => {
      this.loggedWaiter = user;

      this.restaurantService.getRestaurantById(this.loggedWaiter.restaurant).subscribe((restaurant) => {
        this.restaurant = restaurant;

        this.reservationsInTimeframe = [];
        this.reservationsService
          .getValidReservationsInTimeframe(
            this.restaurant._id,
            this.reservation.datetime_start,
            this.reservation.datetime_end
          )
          .subscribe((reservations) => {
            if (reservations) {
              this.reservationsInTimeframe = reservations;
              this.reservationsInTimeframe.forEach((reservation) => {
                this.restaurant.layout.tables.forEach((table) => {
                  if (table._id == reservation.table) {
                    table.taken = true;
                  }
                });
              });

              if (this.reservation.table != null || this.reservation.table != '') {
                this.restaurant.layout.tables.forEach((table) => {
                  if (
                    table._id == this.reservation.table &&
                    (table.taken == false || table.taken == undefined)
                  ) {
                    table.selected = true;
                    this.selectedTable = table._id;
                  }
                });
              }

              if (this.myCanvas != null) {
                const ctx = this.myCanvas.getContext('2d');
                lf.drawDrawingSpaceBorders(ctx);
                lf.writeRestaurantName(ctx, `Restaurant: ${this.restaurant.name}`);
                lf.writeDateAndTime(ctx, new Date(this.reservation.datetime_start));
                lf.drawAll(this.restaurant.layout, ctx);
              }
            }
          });
      });
    });
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    this.myCanvas = canvas;

    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));

    if (ctx) {
      lf.drawDrawingSpaceBorders(ctx);
    } else {
      console.error('Unable to get 2D context');
    }
  }

  handleMouseDown(event: MouseEvent): void {
    this.messageCanvas = '';
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const ctx = this.myCanvas.getContext('2d');
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    lf.unmarkTableAsSeleceted(this.restaurant.layout.tables);
    this.selectedTable = '';
    this.messageCanvas = lf.markTableAsSelected(
      this.restaurant.layout.tables,
      x,
      y,
      this.reservation.number_of_people
    );
    this.restaurant.layout.tables.forEach((table) => {
      if (table.selected) this.selectedTable = table._id;
    });
    lf.clearDrawingSpace(ctx);
    lf.drawAll(this.restaurant.layout, ctx);
  }

  acceptReservation() {
    if (this.selectedTable == '') {
      this.messageCanvas = 'You must first select a table.';
      return;
    }

    this.reservationsService
      .acceptReservation(this.reservation._id, this.loggedWaiter._id, this.selectedTable)
      .subscribe((resp) => {
        if (resp) {
          alert('Reservation accepted');
          localStorage.removeItem('reservation');
          this.router.navigate(['waiter/reservations']);
        }
      });
  }
}
