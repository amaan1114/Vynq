import express from 'express';
import { signUpController, signInController, verifyUserController, refreshTokenController, getMeController } from './auth.controller.js';
import { checkAuth } from './auth.middleware.js';
const Authrouter: express.Router = express.Router();

Authrouter.post('/signup', signUpController);
Authrouter.post('/signin', signInController);
Authrouter.post('/verify', verifyUserController);
Authrouter.post('/refresh', refreshTokenController);
Authrouter.get('/me', checkAuth, getMeController);

export default Authrouter;

