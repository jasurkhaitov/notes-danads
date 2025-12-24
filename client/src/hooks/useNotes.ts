import { useState, useCallback } from 'react';
import { apiService } from '@/services/api';
import { Note, PaginatedResponse, CreateNoteDto, UpdateNoteDto, ApiError } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface UseNotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useNotes() {
  const { toast } = useToast();
  const [state, setState] = useState<UseNotesState>({
    notes: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  });

  const fetchNotes = useCallback(async (
    page: number = 1,
    limit: number = 10,
    search?: string
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response: PaginatedResponse<Note> = await apiService.getNotes(page, limit, search);
      setState(prev => ({
        ...prev,
        notes: response.data,
        loading: false,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        },
      }));

      console.log(response);
      
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError.message,
      }));
      toast({
        variant: 'destructive',
        title: 'Error fetching notes',
        description: apiError.message,
      });
    }
  }, [toast]);

  const createNote = useCallback(async (data: CreateNoteDto): Promise<Note | null> => {
    try {
      const note = await apiService.createNote(data);
      toast({
        title: 'Note created',
        description: 'Your note has been created successfully.',
      });
      return note;
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: 'destructive',
        title: 'Error creating note',
        description: apiError.message,
      });
      return null;
    }
  }, [toast]);

  const updateNote = useCallback(async (
    id: string,
    data: UpdateNoteDto
  ): Promise<Note | null> => {
    try {
      const note = await apiService.updateNote(id, data);
      toast({
        title: 'Note updated',
        description: 'Your note has been updated successfully.',
      });
      return note;
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: 'destructive',
        title: 'Error updating note',
        description: apiError.message,
      });
      return null;
    }
  }, [toast]);

  const deleteNote = useCallback(async (id: string): Promise<boolean> => {
    try {
      await apiService.deleteNote(id);
      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted successfully.',
      });
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: 'destructive',
        title: 'Error deleting note',
        description: apiError.message,
      });
      return false;
    }
  }, [toast]);

  return {
    ...state,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}

export function useNote(id: string) {
  const { toast } = useToast();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNote = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getNoteById(id);
      setNote(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching note',
        description: apiError.message,
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  return { note, loading, error, fetchNote };
}
