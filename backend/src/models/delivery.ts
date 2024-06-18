import mongoose, { Schema } from 'mongoose';

const deliverySchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  restaurant: { type: Schema.Types.ObjectId, ref: 'RestaurantModel' },
  items: { type: [{ meal: Schema.Types.ObjectId, quantity: Number }] },
  status: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  total_price: { type: Number },
  estimated_delivery: { type: Date, default: null },
});

export default mongoose.model('DeliveryModel', deliverySchema, 'deliveries');
