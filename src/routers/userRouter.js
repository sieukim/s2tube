import express from 'express';
import {
  getEditPassword,
  postEditPassword,
  getEditProfile,
  postEditProfile,
  userDetail,
} from '../controllers/userController';
import { onlyPrivate, uploadAvatar } from '../middlewares';
import routes from '../routes';

const userRouter = express.Router();

userRouter.get(routes.editProfile, onlyPrivate, getEditProfile);
userRouter.post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);
userRouter.get(routes.editPassword, onlyPrivate, getEditPassword);
userRouter.post(routes.editPassword, onlyPrivate, postEditPassword);
userRouter.get(routes.userDetail(), userDetail);
export default userRouter;
