import { api } from "@/lib/axios";
import type { ApiResponse, Conversation, PrivateConversation } from "./types";

// The signed-in user's conversations, most recent activity first
export const getConversations = async () => {
  const { data } = await api.get<ApiResponse<Conversation[]>>("/conversations");
  return data.data;
};

// Returns the existing private conversation with this user, or creates one
export const createConversation = async (recipientId: string) => {
  const { data } = await api.post<ApiResponse<PrivateConversation>>("/conversations", { recipientId });
  return data.data;
};
