import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  safety_question: { type: String, required: true },
  safety_answer: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  credit_card: { type: String, default: '' },
  profile_picture: { type: String, required: true },
  type: { type: String, required: true },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'RestaurantModel',
    default: null,
  },
  active: { type: String, default: 'active' },
  didnt_show_cnt: { type: Number, default: 0 },
});

export default mongoose.model('UserModel', userSchema, 'users');
