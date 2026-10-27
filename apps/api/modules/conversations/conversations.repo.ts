import { models } from "@repo/db/config/cassandra";
import { toUuid } from "../../utils/uuid.js";

// No try/catch here, same as auth.repo: driver errors bubble up to the controller's next(err),
// and globalErrorHandler logs the original error and answers 500
// Ids come in as strings; toUuid converts them because express-cassandra rejects plain strings for uuid columns
export const getConversationsByUserId = async(userId:string)=>{
    // express-cassandra has find/findOne only; there is no findAll
    return models.instance.conversations_by_user.findAsync({user_id:toUuid(userId)},{raw:true});
}

export const getPrivateConversationByUserIds = async(pairKey:string)=>{
    // findOneAsync resolves to undefined when no row matches
    return models.instance.private_conversations.findOneAsync({pair_key:pairKey},{raw:true});
}

export const createPrivateConversation = async(pairKey:string,userAId:string,userBId:string)=>{
    // Ids and timestamps set here, not left to model defaults: express-cassandra doesn't copy defaults back onto the instance
    const newConversation = new models.instance.private_conversations({
        conversation_id:models.uuid(),
        created_at:new Date(),
        pair_key:pairKey,
        user_a_id:toUuid(userAId),
        user_b_id:toUuid(userBId)
    });
    await newConversation.saveAsync();
    return newConversation;
}

export const getUserConversation = async(userId:string,conversationId:string)=>{
    // conversation_id sits after last_message_at in the clustering key, so it needs ALLOW FILTERING;
    // that only scans this one user's partition, not the table
    return models.instance.conversations_by_user.findOneAsync(
        {user_id:toUuid(userId),conversation_id:toUuid(conversationId)},
        {raw:true,allow_filtering:true}
    );
}

export const addUserConversation = async(row:{
    user_id:string,
    conversation_id:string,
    other_user_id:string,
    conversation_name:string,
    last_message:string|null,
    last_message_at:Date,
    created_at:Date
})=>{
    const newRow = new models.instance.conversations_by_user({
        ...row,
        user_id:toUuid(row.user_id),
        conversation_id:toUuid(row.conversation_id),
        other_user_id:toUuid(row.other_user_id)
    });
    await newRow.saveAsync();
    return newRow;
}

export const deleteUserConversation = async(userId:string,lastMessageAt:Date,conversationId:string)=>{
    // Cassandra deletes by full primary key
    await models.instance.conversations_by_user.deleteAsync({
        user_id:toUuid(userId),
        last_message_at:lastMessageAt,
        conversation_id:toUuid(conversationId)
    });
}
