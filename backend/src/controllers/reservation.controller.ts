import express from 'express';
import ReservationM from '../models/reservation';
const UserModel = require('../models/user');
import _ from 'lodash';
import restaurant from '../models/restaurant';

export class ReservationController {
  getAllComments = (req: express.Request, res: express.Response) => {
    let restaurant_id = req.params.restaurant_id;

    ReservationM.find({ restaurant: restaurant_id, showed_up: true })
      .then((reservations) => {
        res.json(reservations);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  newReservation = (req: express.Request, res: express.Response) => {
    let reservation = {
      restaurant: req.body.restaurant,
      table: req.body.table,
      user: req.body.user,
      datetime_start: new Date(decodeURIComponent(req.body.datetime_start)),
      datetime_end: new Date(decodeURIComponent(req.body.datetime_end)),
      additional_requirements: req.body.additional_requirements,
      status: 'pending',
      number_of_people: req.body.number_of_people,
    };

    new ReservationM(reservation)
      .save()
      .then((reservation) => {
        res.json(reservation);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getValidReservationsInTimeframe = (req: express.Request, res: express.Response) => {
    let restaurant_id = req.params.restaurant_id;
    let start = req.params.start;
    let end = req.params.end;

    try {
      const datetime_start = new Date(decodeURIComponent(start));
      const datetime_end = new Date(decodeURIComponent(end));

      ReservationM.find({
        restaurant: restaurant_id,
        $and: [
          {
            $or: [{ status: 'accepted' }, { status: 'finished', showed_up: true }],
          },
          {
            $or: [
              { datetime_start: { $gte: datetime_start, $lt: datetime_end } },
              { datetime_end: { $gte: datetime_start, $lt: datetime_end } },
              {
                $and: [
                  { datetime_start: { $lt: datetime_start } },
                  { datetime_end: { $gte: datetime_end } },
                ],
              },
            ],
          },
        ],
      }).then((reservations) => {
        res.json(reservations);
      });
    } catch (error) {
      console.log(error);
    }
  };

  getPendingReservations = (req: express.Request, res: express.Response) => {
    let restaurant_id = req.params.restaurant_id;

    ReservationM.find({
      restaurant: restaurant_id,
      status: 'pending',
    }).then((reservations) => {
      res.json(reservations);
    });
  };

  getAcceptedReservations = (req: express.Request, res: express.Response) => {
    let restaurant_id = req.params.restaurant_id;

    ReservationM.find({
      restaurant: restaurant_id,
      status: 'accepted',
    }).then((reservations) => {
      res.json(reservations);
    });
  };

  getCurrentlyHereReservations = (req: express.Request, res: express.Response) => {
    let restaurant_id = req.params.restaurant_id;

    let datetime_now = new Date();

    ReservationM.find({
      restaurant: restaurant_id,
      status: 'finished',
      showed_up: true,
      $and: [{ datetime_start: { $lt: datetime_now } }, { datetime_end: { $gte: datetime_now } }],
    }).then((reservations) => {
      res.json(reservations);
    });
  };

  acceptReservation = (req: express.Request, res: express.Response) => {
    let id = req.body._id;
    let waiter = req.body.waiter;
    let table = req.body.table;

    ReservationM.findOneAndUpdate(
      { _id: id },
      { waiter: waiter, table: table, status: 'accepted' }
    ).then((reservation) => {
      res.json(reservation);
    });
  };

  declineReservation = (req: express.Request, res: express.Response) => {
    let id = req.body._id;
    let waiter = req.body.waiter;
    let declined_comment = req.body.declined_comment;

    ReservationM.findOneAndUpdate(
      { _id: id },
      { waiter: waiter, declined_comment: declined_comment, status: 'declined' }
    ).then((reservation) => {
      res.json(reservation);
    });
  };

  cancelReservation = (req: express.Request, res: express.Response) => {
    let reservation_id = req.body.reservation_id;

    ReservationM.findOneAndUpdate({ _id: reservation_id }, { status: 'canceled' }).then(
      (reservation) => {
        res.json(reservation);
      }
    );
  };

  setFinished = (req: express.Request, res: express.Response) => {
    let reservation_id = req.body.reservation_id;
    let showed_up = req.body.showed_up;

    ReservationM.findOneAndUpdate(
      { _id: reservation_id },
      { status: 'finished', showed_up: showed_up }
    ).then((reservation) => {
      res.json(reservation);
    });
  };

  increaseTime = (req: express.Request, res: express.Response) => {
    let reservation_id = req.body.reservation_id;

    ReservationM.findOne({ _id: reservation_id }).then((reservation) => {
      const newDate = new Date(reservation.datetime_end.getTime() + 30 * 60000);
      ReservationM.findOneAndUpdate(
        { _id: reservation_id },
        { datetime_end: newDate, time_increased: true },
        { returnDocument: 'after' }
      ).then((reservation) => {
        res.json(reservation);
      });
    });
  };

  getAllOfUsersReservations = (req: express.Request, res: express.Response) => {
    let user_id = req.params.user_id;

    ReservationM.find({ user: user_id }).then((reservations) => {
      res.json(reservations);
    });
  };

  addCommentAndRating = (req: express.Request, res: express.Response) => {
    let reservation_id = req.body.reservation_id;
    let comment = req.body.comment;
    let rating = req.body.rating;

    ReservationM.findOneAndUpdate(
      { _id: reservation_id },
      { comment: comment, rating: rating },
      { returnDocument: 'after' }
    )
      .then((reservation) => {
        res.json(reservation);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getAll = (req: express.Request, res: express.Response) => {
    ReservationM.find({}).then((reservations) => {
      res.json(reservations);
    });
  };

  getWaitersReservations = (req: express.Request, res: express.Response) => {
    let waiter_id = req.params.waiter_id;

    ReservationM.find({ waiter: waiter_id }).then((reservations) => {
      res.json(reservations);
    });
  };
}
