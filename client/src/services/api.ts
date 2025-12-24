import { Note, PaginatedResponse, CreateNoteDto, UpdateNoteDto, ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error: ApiError = {
          message: `Request failed with status ${response.status}`,
          statusCode: response.status,
        };
        
        try {
          const errorData = await response.json();
          error.message = errorData.message || error.message;
        } catch {
          console.log(error);
        }
        
        throw error;
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }
      throw {
        message: 'Network error. Please check your connection.',
        statusCode: 0,
      } as ApiError;
    }
  }

  async getNotes(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedResponse<Note>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }

    return this.request<PaginatedResponse<Note>>(`/notes?${params.toString()}`);
  }

  async getNoteById(id: string): Promise<Note> {
    return this.request<Note>(`/notes/${id}`);
  }

  async createNote(data: CreateNoteDto): Promise<Note> {
    return this.request<Note>('/notes/post', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNote(id: string, data: UpdateNoteDto): Promise<Note> {
    return this.request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNote(id: string): Promise<void> {
    return this.request<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
