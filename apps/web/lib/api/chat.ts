import { api } from "@/lib/axios";
import type { ApiResponse, Message } from "./types";
import {socket} from '@/lib/socket'

// Newest first, as the messages_by_conversation table is clustered
export const getMessages = async (conversationId: string) => {
  const { data } = await api.get<ApiResponse<Message[]>>(`/chats/${encodeURIComponent(conversationId)}`);
  return data.data;
};

export const sendMessage = async (conversationId: string, content: string, messageType?: string) => {
  const res = await socket.timeout(10_000).emitWithAck(
    "send_message",
    {
      conversationId: conversationId,
      content: content,
      message_type:messageType
    },
  );
  if (!res.success || !res.message) throw new Error(res.error ?? "Message not sent.");
  return res.message;

};

export const joinConversation = async (conversationId: string) => {
  const res = await socket.timeout(10_000).emitWithAck("join_conversation", conversationId);
  if (!res.success) throw new Error(res.error ?? "Couldn't join chat.");
};

export const leaveConversation = (conversationId: string) => {
  socket.emit("leave_conversation", conversationId);
};
