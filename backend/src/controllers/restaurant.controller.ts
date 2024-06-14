import express from 'express';
import RestaurantM from '../models/restaurant';
import _ from 'lodash';
import restaurant from '../models/restaurant';

export class RestaurantController {
  addNew = (req: express.Request, res: express.Response) => {
    let restaurant = new RestaurantM({
      name: req.body.name,
      type: req.body.type,
      address: req.body.address,
      short_description: req.body.short_description,
      contact_person: req.body.contact_person,
      average_rating: req.body.average_rating,
      working_time_start: req.body.working_time_start,
      working_time_end: req.body.working_time_end,
      layout: req.body.layout,
    });

    new RestaurantM(restaurant)
      .save()
      .then((ok) => {
        res.json({ restaurant: restaurant, message: 'ok' });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: 'Error adding new restaurant' });
      });
  };

  getAll = (req: express.Request, res: express.Response) => {
    RestaurantM.find()
      .then((restaurants) => {
        res.json(restaurants);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getRestaurantById = (req: express.Request, res: express.Response) => {
    let restaurant_id = req.params.restaurant_id;

    RestaurantM.findOne({ _id: restaurant_id })
      .then((restaurant) => {
        res.json(restaurant);
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: 'Error getting all restaurants' });
      });
  };

  updateAvgRating = (req: express.Request, res: express.Response) => {
    let rating = req.body.rating;

    RestaurantM.findOne({ _id: req.body.restaurant_id })
      .then((restaurant) => {
        let new_num_of_ratings = 1;
        if (restaurant.num_of_ratings == 0 || restaurant.num_of_ratings == undefined) {
          restaurant.average_rating = rating;
        } else {
          let new_num_of_ratings = restaurant.num_of_ratings + 1;
          restaurant.average_rating =
            (restaurant.average_rating * restaurant.num_of_ratings + rating) / new_num_of_ratings;
        }

        RestaurantM.findOneAndUpdate(
          { _id: req.body.restaurant_id },
          { num_of_ratings: new_num_of_ratings, average_rating: restaurant.average_rating },
          { returnDocument: 'after' }
        )
          .then((restaurant) => {
            res.json(restaurant);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
