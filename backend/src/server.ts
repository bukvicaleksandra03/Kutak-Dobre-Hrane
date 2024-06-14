import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routers/user.router";
import restaurantRouter from "./routers/restaurant.router";
import reservationRouter from "./routers/reservations.router";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/KutakDobreHrane");
const conn = mongoose.connection;
conn.once("open", () => {
  console.log("DB ok");
});

const router = express.Router();
router.use("/pictures", express.static(path.join(__dirname, "../pictures")));
router.use("/users", userRouter);
router.use("/restaurants", restaurantRouter);
router.use("/reservations", reservationRouter);

app.use("/", router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
