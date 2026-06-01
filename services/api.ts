import { API_V1 } from '../config/api';

export type ApiError = {
  code: string;
  message: string;
};

export class ApiRequestError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 0) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
  }
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_V1}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.success === false) {
    const err = data?.error as ApiError | undefined;
    const detail =
      typeof data?.detail === 'string'
        ? data.detail
        : Array.isArray(data?.detail)
          ? String(data.detail[0]?.msg ?? data.detail[0])
          : undefined;

    if (res.status === 401) {
      unauthorizedHandler?.();
      throw new ApiRequestError(
        err?.code ?? 'TOKEN_EXPIRED',
        err?.message ?? detail ?? 'Session expired. Please sign in again.',
        401,
      );
    }

    throw new ApiRequestError(
      err?.code ?? 'REQUEST_FAILED',
      err?.message ?? detail ?? data?.message ?? 'Request failed',
      res.status,
    );
  }

  return data as T;
}
