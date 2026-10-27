import HttpError from '../../utils/httpError.js';
import {
    getConversationsByUserId,
    getPrivateConversationByUserIds,
    createPrivateConversation,
    getUserConversation,
    addUserConversation,
    deleteUserConversation
} from './conversations.repo.js';
import { getUserById } from '../users/user.repo.js';

export const getConversationService = async(userId:string)=>{

    const conversations = await getConversationsByUserId(userId);
    return conversations;

}

// Each user needs their own conversations_by_user row for the chat to show up in their list.
// Only rows that are missing get written, so conversations created before this existed are backfilled too
const ensureConversationRows = async(conversationId:string,userAId:string,userBId:string,createdAt:Date)=>{
    const sides = [[userAId,userBId],[userBId,userAId]] as const;
    await Promise.all(sides.map(async([userId,otherUserId])=>{
        const existing = await getUserConversation(userId,conversationId);
        if(existing) return;
        const otherUser = await getUserById(otherUserId);
        await addUserConversation({
            user_id:userId,
            conversation_id:conversationId,
            other_user_id:otherUserId,
            // users have no name until they set one, so fall back to the email
            conversation_name:otherUser?.name ?? otherUser?.email ?? 'Unknown user',
            last_message:null,
            // last_message_at is part of the primary key, so it can't be null; start it at the creation time
            last_message_at:createdAt,
            created_at:createdAt
        });
    }));
}

export const createConversationService = async(userAId:string,userBId:string)=>{
    if(!userBId){
        throw new HttpError({statusCode: 400, message: 'recipientId is required'});
    }
    if(userAId === userBId){
        throw new HttpError({statusCode: 400, message: 'Cannot start a conversation with yourself'});
    }
    const recipient = await getUserById(userBId);
    if(!recipient){
        throw new HttpError({statusCode: 404, message: 'Recipient not found'});
    }
    // Ids are uuids, so Number() would give NaN; sorting the strings gives the same key whichever user starts the chat
    const pairKey = [userAId, userBId].sort().join(':');
    const conversation = await getPrivateConversationByUserIds(pairKey) ?? await createPrivateConversation(pairKey,userAId,userBId);
    await ensureConversationRows(conversation.conversation_id.toString(),userAId,userBId,new Date(conversation.created_at ?? Date.now()));
    return conversation;

}

// Moves the conversation to the top of both users' lists with the new last message.
// last_message_at is a clustering column, so the row can't be updated in place: write the new row, then delete the old one
export const updateLastMessageService = async(conversationId:string,senderId:string,content:string,sentAt:Date)=>{
    const senderRow = await getUserConversation(senderId,conversationId);
    // No row means the conversation was never opened through POST /conversations; nothing to update
    if(!senderRow) return;
    const otherUserId = senderRow.other_user_id.toString();
    const otherRow = await getUserConversation(otherUserId,conversationId);

    await Promise.all([senderRow,otherRow].map(async(row)=>{
        if(!row) return;
        const oldLastMessageAt = new Date(row.last_message_at);
        await addUserConversation({
            user_id:row.user_id.toString(),
            conversation_id:conversationId,
            other_user_id:row.other_user_id.toString(),
            conversation_name:row.conversation_name,
            last_message:content,
            last_message_at:sentAt,
            created_at:row.created_at
        });
        // Same timestamp means the insert above overwrote the old row, so deleting would remove the new one
        if(oldLastMessageAt.getTime() !== sentAt.getTime()){
            await deleteUserConversation(row.user_id.toString(),oldLastMessageAt,conversationId);
        }
    }));
}
