export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoadingState<T> {
  isLoading: boolean;
  error: Error | null;
  data?: T | unknown;
}

export interface Logger {
  debug: (message: string) => void;
  info: (message: string) => void;
  error: (message: string) => void;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Tag {
  _id: string;
  name: string;
  color?: string;
  userId: string;
}
