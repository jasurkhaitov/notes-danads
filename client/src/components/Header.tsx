import { Link, useLocation } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/notes';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-serif font-semibold text-foreground">
            Notes
          </span>
        </Link>

        {isHome && (
          <Link to="/notes/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Note</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
