import { models } from "@repo/db/config/cassandra";

// No try/catch here, same as auth.repo: driver errors bubble up to the controller's next(err),
// and globalErrorHandler logs the original error and answers 500
export const getConversationsByUserId = async(userId:string)=>{
    return models.instance.conversations_by_user.findAllAsync({user_id:userId},{raw:true});
}

export const getPrivateConversationByUserIds = async(pairKey:string)=>{
    // findOneAsync resolves to undefined when no row matches
    return models.instance.private_conversations.findOneAsync({pair_key:pairKey},{raw:true});
}

export const createPrivateConversation = async(pairKey:string,userAId:string,userBId:string)=>{
    const newConversation = new models.instance.private_conversations({
        pair_key:pairKey,
        user_a_id:userAId,
        user_b_id:userBId
    });
    await newConversation.saveAsync();
    return newConversation;
}
