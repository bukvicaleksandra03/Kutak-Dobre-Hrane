import express from 'express';
import DeliveryM from '../models/delivery';
import UserM from '../models/user';
import RestauranM from '../models/restaurant';
const https = require('https');

export class DeliveryController {
  getUnorderedDelivery = (req: express.Request, res: express.Response) => {
    let user_id = req.params.user_id;
    let restaurant_id = req.params.restaurant_id;

    DeliveryM.findOne({ restaurant: restaurant_id, user: user_id, status: 'not_ordered' })
      .then((delivery) => {
        res.json(delivery);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createNew = (req: express.Request, res: express.Response) => {
    let deliveryData = req.body.delivery;

    // Ensure the _id field is not present or is properly formatted
    if (deliveryData._id) {
      delete deliveryData._id;
    }

    const delivery = new DeliveryM({
      user: deliveryData.user,
      restaurant: deliveryData.restaurant,
      items: deliveryData.items,
      total_price: deliveryData.total_price,
      status: 'not_ordered',
    });

    delivery
      .save()
      .then((delivery) => {
        res.json(delivery);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateItems = (req: express.Request, res: express.Response) => {
    let delivery_id = req.body.delivery_id;
    let items = req.body.items;
    let total_price = req.body.total_price;

    DeliveryM.findOneAndUpdate(
      { _id: delivery_id },
      { items: items, total_price: total_price },
      { returnDocument: 'after' }
    )
      .then((delivery) => {
        res.json(delivery);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  order = (req: express.Request, res: express.Response) => {
    let delivery_id = req.body.delivery_id;
    let date = Date.now();

    DeliveryM.findOneAndUpdate(
      { _id: delivery_id },
      { status: 'pending', date: date },
      { returnDocument: 'after' }
    )
      .then((delivery) => {
        res.json(delivery);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteDelivery = (req: express.Request, res: express.Response) => {
    let delivery_id = req.body.delivery_id;

    DeliveryM.deleteOne({ _id: delivery_id })
      .then((delivery) => {
        res.json(delivery);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getAllOfUsersDeliveries = (req: express.Request, res: express.Response) => {
    let user_id = req.params.user_id;

    DeliveryM.find({ user: user_id })
      .then((deliveries) => {
        res.json(deliveries);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getRestaurantPendingDeliveries = (req: express.Request, res: express.Response) => {
    let restaurant_id = req.params.restaurant_id;

    DeliveryM.find({ restaurant: restaurant_id, status: 'pending' })
      .then((deliveries) => {
        res.json(deliveries);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  archiveDelivery = (req: express.Request, res: express.Response) => {
    let delivery_id = req.params.delivery_id;

    DeliveryM.findOneAndUpdate({ _id: delivery_id }, { status: 'archived' })
      .then((delivery) => {
        res.json(delivery);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getEstimatedTimeTraffic = (req: express.Request, res: express.Response) => {
    let delivery_id = req.params.delivery_id;

    DeliveryM.findOne({ _id: delivery_id })
      .then(async (delivery) => {
        let user = await UserM.findOne({ _id: delivery.user });
        let restaurant = await RestauranM.findOne({ _id: delivery.restaurant });

        console.log(user.address);
        console.log(restaurant.address);
        let date = new Date(new Date().getTime() + 60 * 1000);

        const apiKey = 'AIzaSyCvjN6Fe_tf7S-c8VGVfuQQOIJxBPU92zU';
        const data = JSON.stringify({
          origin: {
            address: user.address,
          },
          destination: {
            address: restaurant.address,
          },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
          departureTime: date.toISOString(),
          computeAlternativeRoutes: false,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false,
          },
          languageCode: 'en-US',
          units: 'IMPERIAL',
        });

        const options = {
          hostname: 'routes.googleapis.com',
          path: '/directions/v2:computeRoutes',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
          },
        };

        const req = https.request(options, (res2) => {
          let data = '';

          res2.on('data', (chunk) => {
            data += chunk;
          });

          res2.on('end', () => {
            console.log(JSON.parse(data));
            const secondsString = JSON.parse(data).routes[0].duration.match(/\d+/)[0];
            const seconds = parseInt(secondsString, 10);
            const minutes = seconds / 60;
            console.log(minutes);
            res.json(minutes);
          });
        });

        req.on('error', (error) => {
          console.error('Error fetching directions:', error);
        });

        req.write(data);
        req.end();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  acceptDelivery = (req: express.Request, res: express.Response) => {
    let delivery_id = req.body.delivery_id;
    let estimated_time_mins = req.body.estimated_time_mins;

    let minutesForFoodPreparation = 15;
    let totalTimeInMinutes = estimated_time_mins + minutesForFoodPreparation;
    const milliseconds = minutesForFoodPreparation * 60 * 1000;
    const newTime = new Date().getTime() + milliseconds;

    DeliveryM.findOneAndUpdate(
      { _id: delivery_id },
      { status: 'accepted', estimated_delivery: new Date(newTime) },
      { returnDocument: 'after' }
    )
      .then((delivery) => {
        res.json(delivery);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  declineDelivery = (req: express.Request, res: express.Response) => {
    let delivery_id = req.body.delivery_id;

    DeliveryM.findOneAndUpdate({ _id: delivery_id }, { status: 'declined' }, { returnDocument: 'after' })
      .then((delivery) => {
        res.json(delivery);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
