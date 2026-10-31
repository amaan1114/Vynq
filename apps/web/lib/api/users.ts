import { AxiosError } from "axios";
import { api } from "@/lib/axios";
import type { ApiResponse, UserSearchResult } from "./types";

// The API answers 404 when nobody matches, so treat that as an empty list
export const searchUsers = async (query: string) => {
  try {
    const { data } = await api.get<ApiResponse<UserSearchResult[]>>("/users/search", { params: { query } });
    return data.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) return [];
    throw error;
  }
};
