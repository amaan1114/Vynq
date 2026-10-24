import { models } from "@repo/db/config/cassandra";

export const fetchMessagesFromDatabase = async(conversationId:string)=>{
    // conversation_id is the partition key, so this reads one partition; rows come back newest first (message_id desc)
    return models.instance.messages_by_conversation.findAsync({ conversation_id: conversationId }, { raw: true });
}

export const sendMessageToDatabase = async(conversationId:string, senderId:string, content:string, messageType:string = 'text')=>{
    // message_id (timeuuid) and created_at are filled by the model defaults
    const newMessage = new models.instance.messages_by_conversation({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content,
        message_type: messageType,
    });
    await newMessage.saveAsync();
    return newMessage;
}