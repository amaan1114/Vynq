import express from "express";
import { getMessageController} from "./chat.controller.js";
import {checkAuth} from "../auth/auth.middleware.js";
const chatRouter: express.Router  = express.Router();

chatRouter.get('/:convoId',checkAuth, getMessageController);

export default chatRouter;