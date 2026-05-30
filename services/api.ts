import { API_V1 } from '../config/api';

export type ApiError = {
  code: string;
  message: string;
};

export class ApiRequestError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
  }
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
    throw new ApiRequestError(
      err?.code ?? 'REQUEST_FAILED',
      err?.message ?? detail ?? data?.message ?? 'Request failed',
    );
  }

  return data as T;
}
