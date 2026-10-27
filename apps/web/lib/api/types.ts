import { AxiosError } from "axios";

// Every API route answers with this shape (httpResponse / globalErrorHandler on the backend)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface UserSearchResult {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
}

export interface Conversation {
  user_id: string;
  conversation_id: string;
  other_user_id: string;
  conversation_name: string | null;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
}

export interface PrivateConversation {
  pair_key: string;
  conversation_id: string;
  user_a_id: string;
  user_b_id: string;
  created_at: string;
}

export interface Message {
  conversation_id: string;
  message_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
}

// Pulls the backend's `message` out of a failed request so forms can show it as-is
export const getErrorMessage = (error: unknown, fallback = "Something went wrong. Please try again.") => {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as Partial<ApiResponse<unknown>> | undefined)?.message;
    if (message) return message;
    if (!error.response) return "Can't reach the server. Check your connection.";
  }
  return fallback;
};
