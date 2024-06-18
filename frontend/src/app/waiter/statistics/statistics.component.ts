import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { User } from 'src/app/models/user';
import { ReservationsService } from 'src/app/services/reservations.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent {
  public barChartLegend = true;
  public barChartPlugins = [];
  waiter: User = new User();
  weeksData: number[] = Array.from({ length: 7 }, () => 0);

  public barChartData: ChartConfiguration<'bar'>['data'];

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [];
  public pieChartDatasets = [{ data: [] }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private reservationService: ReservationsService, private usersService: UserService) {}

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: 'Average reservation count',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend = true;

  ngOnInit() {
    this.usersService.getUserProfile().subscribe((user) => {
      this.waiter = user;

      this.reservationService.getWaitersReservations(this.waiter._id).subscribe((reservations) => {
        reservations.forEach((reservation) => {
          let now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (new Date(reservation.created_at) > oneWeekAgo) {
            this.weeksData[new Date(reservation.created_at).getDay()]++;
          }
        });

        this.barChartData = {
          labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          datasets: [{ data: this.weeksData, label: 'Number of my guests per day' }],
        };
      });

      let labels = [];
      let data = [];

      this.usersService
        .getWaitersForRestaurantId(this.waiter.restaurant)
        .subscribe((waiters: User[]) => {
          waiters.forEach((waiter) => {
            labels.push(waiter.username);
            data.push(0);
          });

          this.reservationService.getAll().subscribe((reservations) => {
            reservations.forEach((reservation) => {
              if (reservation.restaurant == this.waiter.restaurant) {
                this.usersService.getUsername(reservation.waiter).subscribe((username) => {
                  data[labels.indexOf(username)]++;
                });
              }
            });

            this.pieChartLabels = labels;
            this.pieChartDatasets = [
              {
                data: data,
              },
            ];
          });
        });

      let histogram_data = [0, 0, 0, 0, 0, 0, 0];
      this.reservationService.getAll().subscribe((reservations) => {
        reservations.forEach((reservation) => {
          let now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
          if (new Date(reservation.created_at) > oneWeekAgo) {
            this.weeksData[new Date(reservation.created_at).getDay()]++;
          }
        });

        for (let i = 0; i < histogram_data.length; i++) {
          this.lineChartData.datasets[0].data[i] = histogram_data[i] / (2 * 52);
        }
      });
    });
  }
}
