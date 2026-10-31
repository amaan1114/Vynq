import { api } from "@/lib/axios";
import type { ApiResponse, User } from "./types";

export interface Credentials {
  email: string;
  password: string;
}

// Creates the account and emails a verification link; the user can't sign in until it's opened
export const signUp = async (credentials: Credentials) => {
  const { data } = await api.post<ApiResponse<null>>("/auth/signup", credentials);
  return data;
};

// Sets the accessToken and refreshToken cookies; nothing useful in the body
export const signIn = async (credentials: Credentials) => {
  const { data } = await api.post<ApiResponse<null>>("/auth/signin", credentials);
  return data;
};

// Clears both auth cookies on the API
export const signOut = async () => {
  const { data } = await api.post<ApiResponse<null>>("/auth/signout");
  return data;
};

export const verifyEmail = async (token: string) => {
  const { data } = await api.post<ApiResponse<null>>("/auth/verify", { token });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get<ApiResponse<User>>("/auth/me");
  return data.data;
};
