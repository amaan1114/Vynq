import express from 'express';
import { signUpController, signInController, verifyUserController, refreshTokenController } from './auth.controller.js';

const Authrouter: express.Router = express.Router();

Authrouter.post('/signup', signUpController);
Authrouter.post('/signin', signInController);
Authrouter.post('/verify', verifyUserController);
Authrouter.post('/refresh', refreshTokenController);

export default Authrouter;