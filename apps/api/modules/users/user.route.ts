import express from 'express';
import {searchUsersController} from './user.controller.js';
import { checkAuth } from '../auth/auth.middleware.js'; 
const userRouter: express.Router  = express.Router();


userRouter.get('/search', checkAuth, searchUsersController);
export default userRouter;



