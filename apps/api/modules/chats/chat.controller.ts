import type {Request,Response,NextFunction} from 'express'
import {httpResponse} from '../../utils/httpResponse.js';
import {getMessageService,sendMessageService} from './chat.services.js';
export const getMessageController = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {convoId} = req.params;
        const messages = await getMessageService(convoId as string);
        return httpResponse({
            success: true,
            req,
            res,
            data: messages,
            statusCode: 200,
            message: 'Messages retrieved successfully'
        });
    }catch(err)
    {
        next(err);
    }
}

export const sendMessageController = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {convoId,content,messageType} = req.body;
        // sender comes from the verified token, not the body, so a client can't send as someone else
        const sentMessage = await sendMessageService(convoId as string,req.user?.id as string,content as string,messageType);
        return httpResponse({
            success: true,
            req,
            res,
            data: sentMessage,
            statusCode: 201,
            message: 'Message sent successfully'
        });
    }catch(err){
        next(err);
    }
}