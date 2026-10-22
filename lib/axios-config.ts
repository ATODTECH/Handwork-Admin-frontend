import axios, { AxiosError, type AxiosRequestConfig } from "axios";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DEFAULT_TIMEOUT_MS = 90_000;

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const client = axios.create({
  baseURL: `${API_BASE_URL}/v2`,
  timeout: DEFAULT_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN_KEY}`,
  },
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new ApiError("Request timed out.", 0, null));
    }
    if (!error.response) {
      // Network failure, DNS error, CORS block, request cancelled, etc.
      return Promise.reject(new ApiError("Network error — could not reach the server.", 0, null));
    }

    const { status, data } = error.response;
    const detail =
      typeof data === "object" && data !== null && "detail" in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).detail)
        : `Request failed with status ${status}`;

    return Promise.reject(new ApiError(detail, status, data));
  }
);

interface RequestOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
}

const toAxiosConfig = (options?: RequestOptions): AxiosRequestConfig => {
  return {
    timeout: options?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    signal: options?.signal, // lets a caller (e.g. React unmount cleanup) cancel the request
  };
}

export const api = {
  get: async <T>(path: string, options?: RequestOptions): Promise<T> =>
    (await client.get<T>(path, toAxiosConfig(options))).data,

  post: async <T>(path: string, body: unknown, options?: RequestOptions): Promise<T> =>
    (await client.post<T>(path, body, toAxiosConfig(options))).data,

  put: async <T>(path: string, body: unknown, options?: RequestOptions): Promise<T> =>
    (await client.put<T>(path, body, toAxiosConfig(options))).data,

  patch: async <T>(path: string, body: unknown, options?: RequestOptions): Promise<T> =>
    (await client.patch<T>(path, body, toAxiosConfig(options))).data,

  delete: async <T>(path: string, options?: RequestOptions): Promise<T> =>
    (await client.delete<T>(path, toAxiosConfig(options))).data,
};
