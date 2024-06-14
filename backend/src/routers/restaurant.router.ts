import express from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';

const restaurantRouter = express.Router();

restaurantRouter.route('/addNew').post((req, res) => new RestaurantController().addNew(req, res));

restaurantRouter.route('/getAll').get((req, res) => new RestaurantController().getAll(req, res));

restaurantRouter
  .route('/getRestaurant/:restaurant_id')
  .get((req, res) => new RestaurantController().getRestaurantById(req, res));

restaurantRouter
  .route('/updateAvgRating')
  .put((req, res) => new RestaurantController().updateAvgRating(req, res));

export default restaurantRouter;
