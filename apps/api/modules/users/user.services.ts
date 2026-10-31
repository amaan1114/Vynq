import {SearchingUsers} from './user.repo.js';
import HttpError from '../../utils/httpError.js';


export const searchingService = async(query:string)=>{
    if(!query){
        throw new HttpError({statusCode: 400, message: 'Search query is required'});
    }
    const users = await SearchingUsers(query.trim());
    if(!users || users.length === 0){
         throw new HttpError({statusCode: 404, message: 'User not found'});
    }
    // Only return public fields; the raw row also has password_hash
    return users.map((user: any) => ({
        id: user.user_id.toString(),
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
    }));
}
