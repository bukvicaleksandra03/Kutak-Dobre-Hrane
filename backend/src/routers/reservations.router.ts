import express from 'express';
import { ReservationController } from '../controllers/reservation.controller';

const reservationRouter = express.Router();

reservationRouter
  .route('/newReservation')
  .post((req, res) => new ReservationController().newReservation(req, res));

// returns Reservation[]
reservationRouter
  .route('/getAllComments/:restaurant_id')
  .get((req, res) => new ReservationController().getAllComments(req, res));

// returns Reservation[]
reservationRouter
  .route('/getValidReservationsInTimeframe/:restaurant_id/:start/:end')
  .get((req, res) => new ReservationController().getValidReservationsInTimeframe(req, res));

reservationRouter
  .route('/getPendingReservations/:restaurant_id')
  .get((req, res) => new ReservationController().getPendingReservations(req, res));

reservationRouter
  .route('/getAcceptedReservations/:restaurant_id')
  .get((req, res) => new ReservationController().getAcceptedReservations(req, res));

reservationRouter
  .route('/getCurrentlyHereReservations/:restaurant_id')
  .get((req, res) => new ReservationController().getCurrentlyHereReservations(req, res));

reservationRouter
  .route('/acceptReservation')
  .put((req, res) => new ReservationController().acceptReservation(req, res));

reservationRouter
  .route('/declineReservation')
  .put((req, res) => new ReservationController().declineReservation(req, res));

reservationRouter
  .route('/cancelReservation')
  .put((req, res) => new ReservationController().cancelReservation(req, res));

reservationRouter
  .route('/setFinished')
  .put((req, res) => new ReservationController().setFinished(req, res));

reservationRouter
  .route('/increaseTime')
  .put((req, res) => new ReservationController().increaseTime(req, res));

reservationRouter
  .route('/getAllOfUsersReservations/:user_id')
  .get((req, res) => new ReservationController().getAllOfUsersReservations(req, res));

reservationRouter
  .route('/addCommentAndRating')
  .put((req, res) => new ReservationController().addCommentAndRating(req, res));

reservationRouter.route('/getAll').get((req, res) => new ReservationController().getAll(req, res));

export default reservationRouter;
