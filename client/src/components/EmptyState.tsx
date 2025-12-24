import { FileText, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'no-notes' | 'no-results';
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function EmptyState({ type, searchQuery, onClearSearch }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No notes found</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          We couldn't find any notes matching "{searchQuery}". Try a different search term or clear your search.
        </p>
        <Button variant="outline" onClick={onClearSearch}>
          Clear search
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-note-highlight flex items-center justify-center mb-6">
        <FileText className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
        Start your journey
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Capture your thoughts, ideas, and important information. Create your first note to get started.
      </p>
      <Link to="/notes/create">
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Create your first note
        </Button>
      </Link>
    </div>
  );
}
