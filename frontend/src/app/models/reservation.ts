export class Reservation {
  _id: string = '';
  restaurant: string = '';
  table: string = '';
  user: string = '';
  datetime_start: Date = new Date();
  datetime_end: Date = new Date();
  comment: string = '';
  rating: number = 0;
  additional_requirements: string = '';
  waiter: string = '';
  status: string = '';
  declined_comment: string = '';
  showed_up: boolean = false;
  number_of_people: number = 0;
  time_increased: boolean = false;
  created_at: Date = new Date();

  username: string = '';
  restaurantName: string = '';
}
