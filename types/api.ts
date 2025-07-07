export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ApiError extends Error {
  status: number;
  code?: string;
  details?: any;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

export interface AuthToken {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}
