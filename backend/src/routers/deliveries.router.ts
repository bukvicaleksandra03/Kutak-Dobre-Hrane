import express from 'express';
import { DeliveryController } from '../controllers/delivery.controller';
import { isWaiter, verifyToken } from '../middleware/verifyToken';

const deliveriesRouter = express.Router();

deliveriesRouter
  .route('/getUnorderedDelivery/:user_id/:restaurant_id')
  .get((req, res) => new DeliveryController().getUnorderedDelivery(req, res));

deliveriesRouter.route('/createNew').post((req, res) => new DeliveryController().createNew(req, res));

deliveriesRouter
  .route('/updateItems')
  .post((req, res) => new DeliveryController().updateItems(req, res));

deliveriesRouter.route('/order').post((req, res) => new DeliveryController().order(req, res));

deliveriesRouter
  .route('/deleteDelivery')
  .post((req, res) => new DeliveryController().deleteDelivery(req, res));

deliveriesRouter
  .route('/getAllOfUsersDeliveries/:user_id')
  .get(verifyToken, (req, res) => new DeliveryController().getAllOfUsersDeliveries(req, res));

deliveriesRouter
  .route('/getRestaurantPendingDeliveries/:restaurant_id')
  .get(verifyToken, isWaiter, (req, res) =>
    new DeliveryController().getRestaurantPendingDeliveries(req, res)
  );

deliveriesRouter
  .route('/archiveDelivery/:delivery_id')
  .get(verifyToken, (req, res) => new DeliveryController().archiveDelivery(req, res));

deliveriesRouter
  .route('/getEstimatedTimeTraffic/:delivery_id')
  .get(verifyToken, (req, res) => new DeliveryController().getEstimatedTimeTraffic(req, res));

deliveriesRouter
  .route('/acceptDelivery')
  .post((req, res) => new DeliveryController().acceptDelivery(req, res));

deliveriesRouter
  .route('/declineDelivery')
  .post((req, res) => new DeliveryController().declineDelivery(req, res));

export default deliveriesRouter;
