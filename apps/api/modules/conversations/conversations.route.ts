import express from "express";
import { getConversationController, createConversationController } from "./conversations.controller.js";
import {checkAuth} from "../auth/auth.middleware.js";
const conversationRouter: express.Router  = express.Router();

conversationRouter.get('/',checkAuth, getConversationController);

conversationRouter.post('/',checkAuth, createConversationController);

export default conversationRouter;