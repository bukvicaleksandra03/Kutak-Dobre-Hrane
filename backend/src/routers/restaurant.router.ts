import express from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';
import { verifyToken, isAdmin } from '../middleware/verifyToken';
const restaurantRouter = express.Router();

restaurantRouter
  .route('/addNew')
  .post(verifyToken, isAdmin, (req, res) => new RestaurantController().addNew(req, res));

restaurantRouter.route('/getAll').get((req, res) => new RestaurantController().getAll(req, res));

restaurantRouter
  .route('/addNewMeal')
  .post(verifyToken, isAdmin, (req, res) => new RestaurantController().addNewMeal(req, res));

restaurantRouter
  .route('/getRestaurant/:restaurant_id')
  .get((req, res) => new RestaurantController().getRestaurantById(req, res));

restaurantRouter
  .route('/updateAvgRating')
  .put((req, res) => new RestaurantController().updateAvgRating(req, res));

restaurantRouter
  .route('/getMeals/:restaurant_id')
  .get((req, res) => new RestaurantController().getMeals(req, res));

export default restaurantRouter;
