import express from 'express';
import { signUpController, signInController, verifyUserController, refreshTokenController, getMeController, signOutController } from './auth.controller.js';
import { checkAuth } from './auth.middleware.js';
const Authrouter: express.Router = express.Router();

Authrouter.post('/signup', signUpController);
Authrouter.post('/signin', signInController);
Authrouter.post('/verify', verifyUserController);
Authrouter.post('/refresh', refreshTokenController);
// No checkAuth: a user whose access token already expired must still be able to clear their cookies
Authrouter.post('/signout', signOutController);
Authrouter.get('/me', checkAuth, getMeController);

export default Authrouter;

