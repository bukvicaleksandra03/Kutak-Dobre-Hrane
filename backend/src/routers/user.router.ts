import express from 'express';
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.route('/login').post((req, res) => new UserController().login(req, res));

userRouter.route('/register').post(async (req, res) => new UserController().register(req, res));

userRouter.route('/upload').post((req, res) => new UserController().upload(req, res));

userRouter.route('/all').get((req, res) => new UserController().getAllUsers(req, res));

userRouter
  .route('/getAllPendingGuests')
  .get((req, res) => new UserController().getAllPendingGuests(req, res));

userRouter.route('/getUsername/:user_id').get((req, res) => new UserController().getUsername(req, res));

userRouter.route('/changePassword').put((req, res) => new UserController().changePassword(req, res));

userRouter.route('/deactivateUser').put((req, res) => new UserController().deactivateUser(req, res));

userRouter.route('/activateUser').put((req, res) => new UserController().activateUser(req, res));

userRouter.route('/unblockGuest').put((req, res) => new UserController().unblockGuest(req, res));

userRouter.route('/declineUser').put((req, res) => new UserController().declineUser(req, res));

userRouter.route('/deleteUser').put((req, res) => new UserController().deleteUser(req, res));

userRouter.route('/updateUser').put((req, res) => new UserController().updateUser(req, res));

userRouter
  .route('/getSafetyQuestion')
  .put((req, res) => new UserController().getSafetyQuestion(req, res));

userRouter
  .route('/checkSafetyAnswer')
  .put((req, res) => new UserController().checkSafetyAnswer(req, res));

userRouter
  .route('/waitersForRestaurant')
  .get((req, res) => new UserController().waitersForRestaurant(req, res));

userRouter
  .route('/increaseDidntShowCnt')
  .put((req, res) => new UserController().increaseDidntShowCnt(req, res));

export default userRouter;
