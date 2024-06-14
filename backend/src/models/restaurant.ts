import mongoose from 'mongoose';

const layoutSchema = new mongoose.Schema({
  kitchens: [{ x: Number, y: Number }],
  toilets: [{ x: Number, y: Number }],
  tables: [{ maxPeople: Number, x: Number, y: Number }],
});

const mealSchema = new mongoose.Schema({
  name: { type: String },
  picture: { type: String },
  price: { type: Number },
  ingredients: { type: [String] },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  short_description: { type: String, required: true },
  contact_person: { type: String, required: true },
  average_rating: { type: Number, default: -1 },
  num_of_ratings: { type: Number, default: 0 },
  working_time_start: { type: String, required: true },
  working_time_end: { type: String, required: true },
  layout: { type: layoutSchema, required: true },
  meals: { type: [mealSchema] },
});

export default mongoose.model('RestaurantModel', restaurantSchema, 'restaurants');
