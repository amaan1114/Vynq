import type{Request,Response,NextFunction} from 'express'
import { httpResponse } from "../../utils/httpResponse.js";
import { searchingService } from "./user.services.js";

export const searchUsersController = async(req:Request,res:Response,next:NextFunction) => {
    try{
        const{query} = req.query;
        const users = await searchingService(query as string);
        return httpResponse({
            success: true,
            req,
            res,
            data: users,
            statusCode: 200,
            message: 'Users retrieved successfully'
        });
    }catch(err){
        next(err);
    }
   
}