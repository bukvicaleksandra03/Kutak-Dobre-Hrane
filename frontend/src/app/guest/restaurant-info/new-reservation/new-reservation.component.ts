import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation';
import { Restaurant } from 'src/app/models/restaurant';
import { User } from 'src/app/models/user';
import { ReservationsService } from 'src/app/services/reservations.service';
import { UserService } from 'src/app/services/user.service';
import * as lf from 'src/app/layoutFuncs';
import { Table } from 'src/app/models/layout';

@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.css'],
})
export class NewReservationComponent implements OnInit {
  restaurant: Restaurant;
  loggedUser: User;

  datetimeStr: string = '';
  datetime: Date;
  numOfPeople: string = '';
  additionalReq: string = '';
  errorMessage: string = '';

  reservationsInTimeframe: Reservation[] = [];

  datetime_selected: boolean = false;

  myCanvas: HTMLCanvasElement;
  messageCanvas: string = '';
  @ViewChild('canvasElement') canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(
    private reservationsService: ReservationsService,
    private router: Router,
    private usersService: UserService
  ) {}

  ngOnInit(): void {
    let restaurantLS = localStorage.getItem('chosenRestaurant');
    if (restaurantLS != null) {
      this.restaurant = JSON.parse(restaurantLS);
    } else {
      return;
    }

    this.usersService.getUserProfile().subscribe((user) => {
      this.loggedUser = user;
    });

    if (this.myCanvas != null) {
      const ctx = this.myCanvas.getContext('2d');
      lf.drawDrawingSpaceBorders(ctx);
      lf.writeRestaurantName(ctx, `Restaurant: ${this.restaurant.name}`);
      lf.drawAll(this.restaurant.layout, ctx);
    }

    this.datetime = null;
    this.datetimeStr = this.numOfPeople = this.additionalReq = '';
    this.errorMessage = this.messageCanvas = '';

    this.reservationsInTimeframe = [];
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    this.myCanvas = canvas;

    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));

    if (ctx) {
      lf.drawDrawingSpaceBorders(ctx);
      lf.drawAll(this.restaurant.layout, ctx);
    } else {
      console.error('Unable to get 2D context');
    }
  }

  handleMouseDown(event: MouseEvent): void {
    this.messageCanvas = '';
    if (this.datetime_selected == false || this.numOfPeople == '' || isNaN(parseInt(this.numOfPeople))) {
      this.messageCanvas = 'You must first enter date and number of people';
      return;
    }
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const ctx = this.myCanvas.getContext('2d');
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    lf.unmarkTableAsSeleceted(this.restaurant.layout.tables);
    this.messageCanvas = lf.markTableAsSelected(
      this.restaurant.layout.tables,
      x,
      y,
      parseInt(this.numOfPeople)
    );
    lf.clearDrawingSpace(ctx);
    lf.drawAll(this.restaurant.layout, ctx);
  }

  makeReservation() {
    if (this.loggedUser.active == 'blocked') {
      this.errorMessage = "You can't make reservations, you are blocked.";
      return;
    }

    this.errorMessage = '';
    if (this.datetime == null || this.datetime == undefined) {
      this.errorMessage = 'Please enter date and time of the reservation';
      return;
    }
    if (this.numOfPeople == '') {
      this.errorMessage = 'Please enter number of people';
      return;
    }
    if (isNaN(parseInt(this.numOfPeople))) {
      this.errorMessage = 'You must enter a number of number of people field';
      return;
    }
    if (this.datetime < new Date()) {
      this.errorMessage = 'Please choose a date and time in the future';
      return;
    }
    if (!Number.isInteger(this.numOfPeople)) {
      this.errorMessage = 'Plese enter a valid number of people for the reservation';
      return;
    }
    if (parseInt(this.numOfPeople) < 1) {
      this.errorMessage = 'Number of people can not be negative';
      return;
    }

    let selected_table_id: string = '';
    this.restaurant.layout.tables.forEach((table) => {
      if (table.selected) {
        if (table.maxPeople < parseInt(this.numOfPeople)) {
          this.errorMessage = 'Please choose a bigger table';
          return;
        }
        selected_table_id = table._id;
      }
    });
    if (selected_table_id == '') selected_table_id = null;

    const hoursToAdd = 3;
    const hoursInMs = hoursToAdd * 60 * 60 * 1000;
    let datetime_end = new Date(this.datetime.getTime() + hoursInMs);

    this.reservationsService
      .newReservation(
        this.restaurant._id,
        selected_table_id,
        this.loggedUser._id,
        this.datetime,
        datetime_end,
        this.additionalReq,
        parseInt(this.numOfPeople)
      )
      .subscribe((reservation) => {
        if (reservation) {
          alert('Reservation successfully added');
          this.restaurant.layout.tables.forEach((table) => {
            table.selected = false;
            table.taken = false;
          });

          localStorage.removeItem('chosenRestaurant');
          this.router.navigate(['guest/restaurants']);
        }
      });
  }

  takenTables: Table[] = [];

  newDateTimeSelected() {
    this.datetime_selected = false;
    this.errorMessage = this.messageCanvas = '';
    this.datetime = new Date(this.datetimeStr);
    let now = new Date();
    if (this.datetime < now) {
      this.errorMessage = 'Please choose a date and time in the future';
      return;
    }

    // if these two are the same than the restaurant is open 24h and we don't have to check weather reservations can be made
    if (this.restaurant.working_time_start != this.restaurant.working_time_end) {
      let canReserveStartTime = this.restaurant.working_time_start;
      let canReserveEndTime = this.adjustTimeByHours(this.restaurant.working_time_end, 3);
      if (!this.isWithinWorkingHours(this.datetimeStr, canReserveStartTime, canReserveEndTime)) {
        this.errorMessage = `Hours for which you can make a reservation are from ${canReserveStartTime} until ${canReserveEndTime}`;
        return;
      }
    }

    const ctx = this.myCanvas.getContext('2d');
    lf.clearDateAndTime(ctx);
    lf.writeDateAndTime(ctx, this.datetime);

    const hoursToAdd = 3;
    const hoursInMs = hoursToAdd * 60 * 60 * 1000;
    let datetime_end = new Date(this.datetime.getTime() + hoursInMs);

    this.reservationsService
      .getValidReservationsInTimeframe(this.restaurant._id, this.datetime, datetime_end)
      .subscribe((reservations) => {
        this.reservationsInTimeframe = [];
        if (reservations) {
          this.reservationsInTimeframe = reservations;
          this.reservationsInTimeframe.forEach((reservation) => {
            this.restaurant.layout.tables.forEach((table) => {
              if (table._id == reservation.table) {
                table.taken = true;
              }
              table.selected = false;
            });
          });

          lf.clearDrawingSpace(ctx);
          lf.drawAll(this.restaurant.layout, ctx);

          this.datetime_selected = true;
          this.messageCanvas = 'Choose a table.';
        }
      });
  }

  // checks weather a date in iso format is withing working hours
  // working hours are given in format "8:00", "22:00"
  isWithinWorkingHours(datetimeStr, start_time, end_time) {
    const date = new Date(datetimeStr);

    const [startHours, startMinutes] = start_time.split(':').map(Number);
    const [endHours, endMinutes] = end_time.split(':').map(Number);

    const startDateTime = new Date(date);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(date);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    return date >= startDateTime && date <= endDateTime;
  }

  // subtracts hours from a string in format "22:00"
  // the return for input ("22:00", 3) would be "19:00"
  adjustTimeByHours(timeStr: string, hoursToSubtract: number) {
    let [hours, minutes] = timeStr.split(':').map(Number);

    hours -= hoursToSubtract;
    if (hours < 0) {
      hours += 24;
    }
    const adjustedHours = hours.toString().padStart(2, '0');
    const adjustedMinutes = minutes.toString().padStart(2, '0');

    return `${adjustedHours}:${adjustedMinutes}`;
  }
}
