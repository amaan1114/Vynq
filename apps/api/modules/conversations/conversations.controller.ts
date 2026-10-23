import type{Response, Request,NextFunction} from 'express'
import {httpResponse} from '../../utils/httpResponse.js';
import {getConversationService,createConversationService} from './conversations.services.js';
export const getConversationController = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = req.user?.id;
        const conversations = await getConversationService(userId as string);
        return httpResponse({
            success: true,
            req,
            res,
            data: conversations,
            statusCode: 200,
            message: 'Conversations retrieved successfully'
        });
    }catch(err){
        next(err);
    }
}

export const createConversationController = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {recipientId} = req.body;
        const createdConversation = await createConversationService(req.user?.id as string,recipientId);
        return httpResponse({
            success: true,
            req,
            res,
            data: createdConversation,
            statusCode: 201,
            message: 'Conversation created successfully'
        });
    }catch(err){
        next(err);

    }
}

