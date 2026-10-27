import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

// Tokens live in httpOnly cookies set by the API, so the browser just has to send them along
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// A 401 from these means "wrong credentials" or "refresh token dead", not "access token expired"
const NO_REFRESH_URLS = ["/auth/signin", "/auth/signup", "/auth/refresh", "/auth/verify"];

// Several requests can 401 at once when the access token expires; they all wait on the same refresh call
let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const isRefreshable =
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !NO_REFRESH_URLS.some((url) => original.url?.startsWith(url));

    if (!isRefreshable) {
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      // /auth/refresh reads the refreshToken cookie and sets a fresh accessToken cookie
      await refreshAccessToken();
    } catch (refreshError) {
      // Refresh token is missing or expired; the caller decides whether to send the user to /signin
      return Promise.reject(refreshError);
    }
    return api(original);
  },
);
