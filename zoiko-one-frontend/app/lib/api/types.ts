export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  skip: number;
  take: number;
  totalPages?: number;
}

export interface ApiErrorBody {
  error: string;
  message?: string;
  statusCode?: number;
  details?: unknown;
}
