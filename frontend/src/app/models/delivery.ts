import { Meal } from './restaurant';

export class Item {
  meal: string = '';
  quantity: number = 0;

  mealObj: Meal = new Meal();
}

export class Delivery {
  _id: string = '';
  restaurant: string = '';
  user: string = '';
  items: Item[] = [];
  status: string = '';
  date: Date;
  total_price: number = 0;
  estimated_delivery: Date;

  restaurantName: string = '';
  itemsString: string = '';
  estimated_delivery_mins: number;
}
