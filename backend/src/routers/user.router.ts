import express from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyToken, isAdmin, isWaiter } from '../middleware/verifyToken';

const userRouter = express.Router();

userRouter.route('/login').post((req, res) => new UserController().login(req, res));

userRouter.route('/register').post(async (req, res) => new UserController().register(req, res));

userRouter.route('/upload').post((req, res) => new UserController().upload(req, res));

userRouter.route('/changePassword').put((req, res) => new UserController().changePassword(req, res));

userRouter
  .route('/getSafetyQuestion')
  .put((req, res) => new UserController().getSafetyQuestion(req, res));

userRouter
  .route('/checkSafetyAnswer')
  .put((req, res) => new UserController().checkSafetyAnswer(req, res));

userRouter.route('/getActiveGuests').get((req, res) => new UserController().getActiveGuests(req, res));

userRouter
  .route('/waitersForRestaurant')
  .get((req, res) => new UserController().waitersForRestaurant(req, res));

userRouter
  .route('/waitersForRestaurantId')
  .get((req, res) => new UserController().waitersForRestaurantId(req, res));

// gets the profile based on the token info
userRouter
  .route('/getUserProfile')
  .get(verifyToken, (req, res) => new UserController().getUserProfile(req, res));

userRouter
  .route('/updateUser')
  .put(verifyToken, (req, res) => new UserController().updateUser(req, res));

userRouter
  .route('/getUsername/:user_id')
  .get(verifyToken, (req, res) => new UserController().getUsername(req, res));

userRouter
  .route('/increaseDidntShowCnt')
  .put(verifyToken, isWaiter, (req, res) => new UserController().increaseDidntShowCnt(req, res));

userRouter.route('/all').get(verifyToken, (req, res) => new UserController().getAllUsers(req, res));

userRouter
  .route('/getAllPendingGuests')
  .get(verifyToken, isAdmin, (req, res) => new UserController().getAllPendingGuests(req, res));

userRouter
  .route('/deactivateUser')
  .put(verifyToken, isAdmin, (req, res) => new UserController().deactivateUser(req, res));

userRouter
  .route('/activateUser')
  .put(verifyToken, isAdmin, (req, res) => new UserController().activateUser(req, res));

userRouter
  .route('/unblockGuest')
  .put(verifyToken, isAdmin, (req, res) => new UserController().unblockGuest(req, res));

userRouter
  .route('/declineUser')
  .put(verifyToken, isAdmin, (req, res) => new UserController().declineUser(req, res));

userRouter
  .route('/deleteUser')
  .put(verifyToken, isAdmin, (req, res) => new UserController().deleteUser(req, res));

export default userRouter;
