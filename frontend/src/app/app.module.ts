import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomePageComponent } from './home-page/home-page.component';
import { GuestComponent } from './guest/guest.component';
import { WaiterComponent } from './waiter/waiter.component';
import { RegisterComponent } from './home-page/register/register.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home-page/home/home.component';
import { LoginComponent } from './home-page/login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminUsersOverviewComponent } from './admin/admin-users-overview/admin-users-overview.component';
import { RegisterRequestsComponent } from './admin/register-requests/register-requests.component';
import { NewWaiterComponent } from './admin/new-waiter/new-waiter.component';
import { NewRestaurantComponent } from './admin/new-restaurant/new-restaurant.component';
import { AllRestaurantsComponent } from './admin/all-restaurants/all-restaurants.component';
import { GuestRestaurantsComponent } from './guest/guest-restaurants/guest-restaurants.component';
import { GuestFoodDeliveryComponent } from './guest/guest-food-delivery/guest-food-delivery.component';
import { ShoppingCartComponent } from './guest/shopping-cart/shopping-cart.component';
import { GuestReservationsComponent } from './guest/guest-reservations/guest-reservations.component';
import { ProfileComponent } from './profile/profile.component';
import { StatisticsComponent } from './waiter/statistics/statistics.component';
import { WaiterReservationsComponent } from './waiter/waiter-reservations/waiter-reservations.component';
import { WaiterDeliveriesComponent } from './waiter/waiter-deliveries/waiter-deliveries.component';
import { WaiterProfileComponent } from './waiter/waiter-profile/waiter-profile.component';
import { ChangeProfileComponent } from './change-profile/change-profile.component';
import { RestaurantInfoComponent } from './guest/restaurant-info/restaurant-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReservationDetailsComponent } from './waiter/reservation-details/reservation-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    GuestComponent,
    WaiterComponent,
    RegisterComponent,
    AdminComponent,
    HomeComponent,
    AdminLoginComponent,
    AdminUsersOverviewComponent,
    RegisterRequestsComponent,
    NewWaiterComponent,
    NewRestaurantComponent,
    AllRestaurantsComponent,
    RegisterRequestsComponent,
    GuestRestaurantsComponent,
    GuestFoodDeliveryComponent,
    ShoppingCartComponent,
    GuestReservationsComponent,
    ProfileComponent,
    StatisticsComponent,
    WaiterReservationsComponent,
    WaiterDeliveriesComponent,
    WaiterProfileComponent,
    ChangeProfileComponent,
    RestaurantInfoComponent,
    ReservationDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
