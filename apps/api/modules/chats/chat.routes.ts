import express from "express";
import { getMessageController, sendMessageController } from "./chat.controller.js";
import {checkAuth} from "../auth/auth.middleware.js";
const chatRouter: express.Router  = express.Router();

chatRouter.get('/:convoId',checkAuth, getMessageController);

chatRouter.post('/',checkAuth, sendMessageController);

export default chatRouter;