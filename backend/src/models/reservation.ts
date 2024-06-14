import mongoose, { Schema } from "mongoose";

const reservationSchema = new mongoose.Schema({
  restaurant: { type: Schema.Types.ObjectId, ref: "RestaurantModel" },
  table: { type: Schema.Types.ObjectId, default: null },
  user: { type: Schema.Types.ObjectId, ref: "UserModel" },
  datetime_start: { type: Date },
  datetime_end: { type: Date },
  additional_requirements: { type: String },
  comment: { type: String, default: "" },
  rating: { type: Number, default: -1 },
  waiter: { type: Schema.Types.ObjectId, ref: "UserModel", default: null },
  status: { type: String, default: "" },
  declined_comment: { type: String, default: "" },
  showed_up: { type: Boolean, default: false },
  number_of_people: { type: Number, default: 0 },
  time_increased: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model(
  "ReservationModel",
  reservationSchema,
  "reservations"
);
