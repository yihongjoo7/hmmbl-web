export interface ApiResponse<T> {
  data:    T;
  message: string;
}

export interface ApiListResponse<T> {
  data:  T[];
  total: number;
  page:  number;
  size:  number;
}


export interface CursorResponse<T> {
  data:       T[];
  nextCursor: string | null;
}

export interface ErrorResponse {
  code:    string;
  message: string;
  detail?: Record<string, string>;
  fields?: Array<{ field: string; message: string }>;
}

export class ApiError extends Error {
  constructor(
    public readonly status:  number,
    public readonly code:    string,
    message:                 string,
    public readonly fields?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
