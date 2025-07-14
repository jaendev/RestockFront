import { RequestOptions } from "@/types/api";
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl ?? "http://localhost:5000/api";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export default async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = "";

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const isJson = res.headers.get("content-type")?.includes("application/json");

  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const error = new Error(data?.message || "Error en la solicitud");
    (error as any).status = res.status;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: any) =>
    request<T>(url, { method: "POST", body }),
  patch: <T>(url: string, body?: any) =>
    request<T>(url, { method: "PATCH", body }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
