export interface Note {
  data: any
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  pagination: any
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateNoteDto {
  title: string;
  content: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
