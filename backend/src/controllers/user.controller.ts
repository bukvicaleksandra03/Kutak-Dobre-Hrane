import express from 'express';
import multer from 'multer';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import UserM from '../models/user';
import RestaurantM from '../models/restaurant';
import jwt from 'jsonwebtoken';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'pictures/');
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now();
    cb(null, uniquePrefix + '-' + file.originalname);
  },
});
const uploadFile = multer({ storage: storage });

export class UserController {
  login = (req: express.Request, res: express.Response) => {
    let usernameP = req.body.username;
    let passwordP = req.body.password;

    UserM.findOne({ username: usernameP })
      .then((user) => {
        if (!user) {
          res.json({ message: 'User not found' });
        } else if (user.active == 'declined') {
          res.json({ message: 'User registration declined.' });
        } else if (user.active == 'deactivated') {
          res.json({ message: 'User deactivated by admin.' });
        } else if (user.active == 'pending') {
          res.json({ message: 'User not active yet.' });
        } else {
          bcrypt.compare(passwordP, user.password!, (err, result) => {
            if (result) {
              const payload = {
                subject: user._id,
                role: user.type,
              };
              const token = jwt.sign(payload, 'secretKey');
              res.json({ message: 'ok', token: token });
            } else {
              res.json({ message: 'Wrong password' });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: 'Error login' });
      });
  };

  register = async (req: express.Request, res: express.Response) => {
    let restName = req.body.restaurant;
    let user = new UserM({
      username: req.body.username,
      safety_question: req.body.safety_question,
      safety_answer: req.body.safety_answer,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      credit_card: req.body.credit_card,
      profile_picture: req.body.profile_picture,
      type: req.body.type,
      active: req.body.active,
    });

    const userWithSameUsername = await UserM.findOne({
      username: user.username,
    });
    if (userWithSameUsername) {
      res.json({ message: 'User with that username already exists' });
    }
    const userWithSameEmail = await UserM.findOne({ email: user.email });
    if (userWithSameEmail) {
      res.json({ message: 'User with that email already exists' });
    }

    if (user.type == 'waiter') {
      user.credit_card = '';
      const restaurant = await RestaurantM.findOne({ name: restName });

      if (!restaurant) {
        console.error('Restaurant not found');
        return;
      }

      user.restaurant = restaurant._id;
    }

    if (!userWithSameEmail && !userWithSameUsername) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          console.log(err);
          res.json({ message: 'Error bcrypt' });
        }
        user.password = hash;
        new UserM(user)
          .save()
          .then((ok) => {
            res.json({ user: user, message: 'ok' });
          })
          .catch((err) => {
            console.log(err);
            res.json({ message: 'Error register' });
          });
      });
    }
  };

  getUserProfile = (req: express.Request, res: express.Response) => {
    let id = (req as any).userId;

    UserM.findOne({ _id: id })
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
      });
  };

  updateUser = async (req: express.Request, res: express.Response) => {
    let user = new UserM({
      _id: req.body._id,
      username: req.body.username,
      safety_question: req.body.safety_question,
      safety_answer: req.body.safety_answer,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      credit_card: req.body.credit_card,
      profile_picture: req.body.profile_picture,
      type: req.body.type,
      restaurant: req.body.restaurant,
    });

    const userWithSameUsername = await UserM.find({ username: user.username });
    userWithSameUsername.forEach((users) => {
      if (users.id != user.id) return res.json({ message: 'User with that username already exists' });
    });
    const userWithSameEmail = await UserM.find({ email: user.email });
    userWithSameEmail.forEach((users) => {
      if (users.id != user.id) return res.json({ message: 'User with that email already exists' });
    });

    if (!res.headersSent) {
      const updateAll = {
        username: user.username,
        safety_question: user.safety_question,
        safety_answer: user.safety_answer,
        firstname: user.firstname,
        lastname: user.lastname,
        gender: user.gender,
        address: user.address,
        phone: user.phone,
        email: user.email,
        credit_card: user.credit_card,
        profile_picture: user.profile_picture,
        type: user.type,
        restaurant: user.restaurant,
      };
      UserM.updateOne({ _id: user.id }, updateAll)
        .then((user) => {
          res.json({ message: 'ok' });
        })
        .catch((err) => {
          console.log(err);
          res.json({ message: 'Fail' });
        });
    }
  };

  changePassword = (req: express.Request, res: express.Response) => {
    bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
      if (err) {
        console.log(err);
        res.json({ message: 'Error bcrypt' });
      }
      UserM.updateOne({ username: req.body.username }, { password: hash })
        .then((user) => {
          res.json({ message: 'ok' });
        })
        .catch((err) => {
          console.log(err);
          res.json({ message: 'Password could not be changed' });
        });
    });
  };

  upload = (req, res) => {
    uploadFile.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.json({ message: 'Error multer.' });
      } else if (err) {
        res.json({ message: 'Error.' });
      }
      if (!req.file) {
        res.json({ message: 'File not sent.' });
      }
      res.json({ filename: req.file.filename, message: 'ok' });
    });
  };

  getAllUsers = (req: express.Request, res: express.Response) => {
    UserM.find()
      .then((users) => {
        res.json({ message: 'ok', users: users });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: 'Error get all users' });
      });
  };

  getActiveGuests = (req: express.Request, res: express.Response) => {
    UserM.find({ type: 'guest', $or: [{ active: 'active' }, { active: 'blocked' }] })
      .then((users) => {
        res.json({ message: 'ok', users: users });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: 'Error get all users' });
      });
  };

  getAllPendingGuests = (req: express.Request, res: express.Response) => {
    UserM.find({ type: 'guest', active: 'pending' })
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getUsername = (req: express.Request, res: express.Response) => {
    const { user_id } = req.params;

    UserM.findOne({ _id: user_id })
      .then((user) => {
        res.json(user.username);
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: 'Error get all users' });
      });
  };

  deactivateUser = (req: express.Request, res: express.Response) => {
    UserM.updateOne({ _id: req.body.id }, { active: 'deactivated' })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  activateUser = (req: express.Request, res: express.Response) => {
    UserM.updateOne({ _id: req.body.id }, { active: 'active' })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  unblockGuest = (req: express.Request, res: express.Response) => {
    UserM.findOneAndUpdate({ _id: req.body.id }, { active: 'active', didnt_show_cnt: 0 })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  declineUser = (req: express.Request, res: express.Response) => {
    UserM.findOneAndUpdate({ _id: req.body.id }, { active: 'declined' })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteUser = (req: express.Request, res: express.Response) => {
    UserM.deleteOne({ _id: req.body.id })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getSafetyQuestion = (req: express.Request, res: express.Response) => {
    UserM.findOne({ username: req.body.username })
      .then((user) => {
        if (user.active != 'active') {
          res.json({ message: "This user is not active and can't change password" });
        } else {
          res.json({ message: 'ok', question: user.safety_question });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "User with that username doesn't exist." });
      });
  };

  checkSafetyAnswer = (req: express.Request, res: express.Response) => {
    UserM.findOne({ username: req.body.username })
      .then((user) => {
        if (user.safety_answer != req.body.safetyAnswer) {
          res.json({ message: 'Safety answer is not correct' });
        } else {
          res.json({ message: 'ok' });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "User with that username doesn't exist." });
      });
  };

  waitersForRestaurant = (req: express.Request, res: express.Response) => {
    let restaurantId = req.query.restaurantId;

    UserM.find({ restaurant: restaurantId })
      .then((waiterList) => {
        let waitersString = '';
        let i = 0;
        for (i = 0; i < waiterList.length - 1; i++) {
          waitersString += waiterList[i].firstname + ' ' + waiterList[i].lastname;
          waitersString += ', ';
        }
        if (waiterList.length > 0)
          waitersString += waiterList[i].firstname + ' ' + waiterList[i].lastname;

        res.json({ message: 'ok', waiters: waitersString });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: 'Error waiters for restaurant.' });
      });
  };

  waitersForRestaurantId = (req: express.Request, res: express.Response) => {
    let restaurantId = req.query.restaurantId;

    UserM.find({ restaurant: restaurantId })
      .then((waiters) => {
        res.json(waiters);
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: 'Error waiters for restaurant.' });
      });
  };

  increaseDidntShowCnt = (req: express.Request, res: express.Response) => {
    let user_id = req.body.user_id;

    UserM.findOneAndUpdate(
      { _id: user_id },
      { $inc: { didnt_show_cnt: 1 } },
      { returnDocument: 'after' }
    )
      .then((user) => {
        if (user.didnt_show_cnt >= 3) {
          UserM.findOneAndUpdate({ _id: user_id }, { active: 'blocked' }).then((user) => {
            res.json(user);
          });
        } else {
          res.json(user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
