import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { NoteCard } from '@/components/NoteCard';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { Button } from '@/components/ui/button';

const NOTES_PER_PAGE = 11;

export default function NotesListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { 
    notes, 
    loading, 
    error, 
    pagination, 
    fetchNotes, 
    deleteNote 
  } = useNotes();

  console.log(`'OK': ${pagination}`);
  

  const loadNotes = useCallback((page: number = 1) => {
    fetchNotes(page, NOTES_PER_PAGE, searchQuery || undefined);
  }, [fetchNotes, searchQuery]);

  useEffect(() => {
    loadNotes(1);
  }, [loadNotes, searchQuery]);

  useEffect(() => {
    fetchNotes(1, NOTES_PER_PAGE);
  }, []);

  const handlePageChange = (page: number) => {
    loadNotes(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await deleteNote(id);
    setDeletingId(null);
    
    if (success) {
      const newTotal = pagination.total - 1;
      const newTotalPages = Math.ceil(newTotal / NOTES_PER_PAGE);
      const targetPage = pagination.page > newTotalPages ? newTotalPages : pagination.page;
      loadNotes(targetPage || 1);
    }
  };

  const handleRefresh = () => {
    loadNotes(pagination.page);
  };

  console.log(notes);
  

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              My Notes
            </h1>
            <p className="text-muted-foreground">
              {pagination.total > 0 
                ? `${pagination.total} note${pagination.total !== 1 ? 's' : ''} in your collection`
                : 'Organize your thoughts and ideas'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <SearchBar 
              value={searchQuery} 
              onChange={handleSearch}
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={loading}
              className="shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {loading && notes.length === 0 ? (
        <LoadingState message="Loading your notes..." />
      ) : error && notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={handleRefresh}>
            Try again
          </Button>
        </div>
      ) : notes.length === 0 ? (
        searchQuery ? (
          <EmptyState 
            type="no-results" 
            searchQuery={searchQuery} 
            onClearSearch={handleClearSearch}
          />
        ) : (
          <EmptyState type="no-notes" />
        )
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {notes.map((note, index) => (
              <div 
                key={note.id} 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <NoteCard 
                  note={note} 
                  onDelete={handleDelete}
                  isDeleting={deletingId === note.id}
                />
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                disabled={loading}
              />
            </div>
          )}
        </>
      )}

      <Link 
        to="/notes/create" 
        className="fixed bottom-6 right-6 sm:hidden z-50"
      >
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Create note</span>
        </Button>
      </Link>
    </div>
  );
}
