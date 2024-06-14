import { Layout } from './layout';

class Meal {
  name: string = '';
  picture: string = '';
  price: number = 0;
  ingredients: string = '';
}

export class Restaurant {
  _id: string = '';
  name: string;
  type: string;
  address: string;
  short_description: string;
  contact_person: string;
  average_rating: number;
  num_of_ratings: number;
  working_time_start: string;
  working_time_end: string;
  layout: Layout;
  meals: Meal[] = [];

  waiters: string = '';
}
