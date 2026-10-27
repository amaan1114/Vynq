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

