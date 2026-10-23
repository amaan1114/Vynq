import HttpError from '../../utils/httpError.js';
import { getConversationsByUserId, getPrivateConversationByUserIds, createPrivateConversation } from './conversations.repo.js';

export const getConversationService = async(userId:string)=>{

    const conversations = await getConversationsByUserId(userId);
    return conversations;

}

export const createConversationService = async(userAId:string,userBId:string)=>{
    if(!userBId){
        throw new HttpError({statusCode: 400, message: 'recipientId is required'});
    }
    if(userAId === userBId){
        throw new HttpError({statusCode: 400, message: 'Cannot start a conversation with yourself'});
    }
    // Ids are uuids, so Number() would give NaN; sorting the strings gives the same key whichever user starts the chat
    const pairKey = [userAId, userBId].sort().join(':');
    const conversations = await getPrivateConversationByUserIds(pairKey);
    if(conversations){
        return conversations
    }else{
        const newConversation = await createPrivateConversation(pairKey,userAId,userBId);
        return newConversation;
    }

}
