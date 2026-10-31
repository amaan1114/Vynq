import HttpError from '../../utils/httpError.js';
import { fetchMessagesFromDatabase, sendMessageToDatabase } from './chat.repo.js';
import { updateLastMessageService } from '../conversations/conversations.services.js';

export const getMessageService = async (conversationId: string)=>{
    if(!conversationId){
        throw new HttpError({statusCode: 400, message: 'Conversation ID is required'});
    }
    const messages = await fetchMessagesFromDatabase(conversationId);
    return messages;
}

export const sendMessageService = async (conversationId: string, senderId: string, content: string, messageType?: string)=>{
    if(!conversationId){
        throw new HttpError({statusCode: 400, message: 'Conversation ID is required'});
    }
    if(!content){
        throw new HttpError({statusCode: 400, message: 'Message content is required'});
    }
    const sentMessage = await sendMessageToDatabase(conversationId, senderId, content, messageType);
    // Keeps the chat list (conversations_by_user) showing the latest message for both users
    await updateLastMessageService(conversationId, senderId, content, sentMessage.created_at);
    return sentMessage;
}