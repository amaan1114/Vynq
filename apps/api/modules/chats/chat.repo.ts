import { models } from "@repo/db/config/cassandra";
import { toUuid } from "../../utils/uuid.js";

export const fetchMessagesFromDatabase = async(conversationId:string)=>{
    // conversation_id is the partition key, so this reads one partition; rows come back newest first (message_id desc)
    console.log(conversationId);
    return models.instance.messages_by_conversation.findAsync({ conversation_id: toUuid(conversationId) }, { raw: true });
}

export const sendMessageToDatabase = async(conversationId:string, senderId:string, content:string, messageType:string = 'text')=>{
    // message_id and created_at are set here, not left to model defaults: express-cassandra doesn't copy defaults
    // back onto the instance, so the returned message would be missing them
    const newMessage = new models.instance.messages_by_conversation({
        message_id: models.timeuuid(),
        created_at: new Date(),
        conversation_id: toUuid(conversationId),
        sender_id: toUuid(senderId),
        content: content,
        message_type: messageType,
    });
    await newMessage.saveAsync();
    return newMessage;
}
