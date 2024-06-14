import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { GuestComponent } from './guest/guest.component';
import { WaiterComponent } from './waiter/waiter.component';
import { RegisterComponent } from './home-page/register/register.component';
import { LoginComponent } from './home-page/login/login.component';
import { HomeComponent } from './home-page/home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminUsersOverviewComponent } from './admin/admin-users-overview/admin-users-overview.component';
import { RegisterRequestsComponent } from './admin/register-requests/register-requests.component';
import { NewWaiterComponent } from './admin/new-waiter/new-waiter.component';
import { AllRestaurantsComponent } from './admin/all-restaurants/all-restaurants.component';
import { NewRestaurantComponent } from './admin/new-restaurant/new-restaurant.component';
import { GuestRestaurantsComponent } from './guest/guest-restaurants/guest-restaurants.component';
import { GuestReservationsComponent } from './guest/guest-reservations/guest-reservations.component';
import { GuestFoodDeliveryComponent } from './guest/guest-food-delivery/guest-food-delivery.component';
import { ShoppingCartComponent } from './guest/shopping-cart/shopping-cart.component';
import { ProfileComponent } from './profile/profile.component';
import { WaiterReservationsComponent } from './waiter/waiter-reservations/waiter-reservations.component';
import { WaiterDeliveriesComponent } from './waiter/waiter-deliveries/waiter-deliveries.component';
import { StatisticsComponent } from './waiter/statistics/statistics.component';
import { WaiterProfileComponent } from './waiter/waiter-profile/waiter-profile.component';
import { ChangeProfileComponent } from './change-profile/change-profile.component';
import { Restaurant } from './models/restaurant';
import { RestaurantInfoComponent } from './guest/restaurant-info/restaurant-info.component';
import { ReservationDetailsComponent } from './waiter/reservation-details/reservation-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'users-overview', component: AdminUsersOverviewComponent },
      { path: 'register-requests', component: RegisterRequestsComponent },
      { path: 'new-waiter', component: NewWaiterComponent },
      { path: 'all-restaurants', component: AllRestaurantsComponent },
      { path: 'new-restaurant', component: NewRestaurantComponent },
    ],
  },
  {
    path: 'guest',
    component: GuestComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'restaurants', component: GuestRestaurantsComponent },
      { path: 'reservations', component: GuestReservationsComponent },
      { path: 'food-delivery', component: GuestFoodDeliveryComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent },
      { path: 'restaurant-info', component: RestaurantInfoComponent },
      { path: 'change-profile', component: ChangeProfileComponent },
    ],
  },
  {
    path: 'waiter',
    component: WaiterComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'reservations', component: WaiterReservationsComponent },
      { path: 'deliveries', component: WaiterDeliveriesComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'reservation-details', component: ReservationDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
