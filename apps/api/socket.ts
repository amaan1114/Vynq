import { io } from "./app.js";
import { sendMessageService } from "./modules/chats/chat.services.js";
import { updateLastMessageService } from "./modules/conversations/conversations.services.js";
import { verifyToken } from "./utils/token.js";
import { parseCookie } from "cookie";
import { getUserConversation } from "./modules/conversations/conversations.repo.js";

io.use(async (socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie;

         if (!cookieHeader) {
            return next(new Error("Authentication required"));
        }

        const cookies = parseCookie(cookieHeader);
        const token = cookies.accessToken;
        if (!token) return next(new Error("Authentication required"));
        const decoded = verifyToken(token as string);

        socket.data.userId = decoded.id;

        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

io.on("connection",(socket)=>{
    console.log("Socket Connection established")

    socket.on("join_conversation", async (conversationId: string, callback) => {
        try {
            // Only members may join, otherwise anyone could listen in by guessing an id
            const membership = await getUserConversation(socket.data.userId, conversationId);
            if (!membership) return callback?.({ success: false, error: "Not a member" });
            socket.join(conversationId);
            callback?.({ success: true });
        } catch {
            callback?.({ success: false, error: "Join failed" });
        }
    });

    socket.on("leave_conversation", (conversationId: string) => {
        socket.leave(conversationId);
    });
    socket.on("send_message",async (data,callback)=>{
        try{
            const senderId = socket.data.userId;
            const membership = await getUserConversation(senderId, data.conversationId);
            if (!membership) return callback?.({ success: false, error: "Not a member" });

            const savedMessage = await sendMessageService(
                data.conversationId,
                senderId,
                data.content,
                data.message_type
            )
          
            socket.to(data.conversationId).emit(
                "new_message",
                savedMessage
            )
            callback?.({ success: true, message: savedMessage });


        }catch(err){
            callback({ success: false, error: "Message failed" });
        }

        
    })

    


})