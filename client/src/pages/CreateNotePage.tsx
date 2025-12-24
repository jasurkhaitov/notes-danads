import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { NoteForm, NoteFormData } from '@/components/NoteForm';
import { Button } from '@/components/ui/button';

export default function CreateNotePage() {
  const navigate = useNavigate();
  const { createNote } = useNotes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true);
    const note = await createNote({ title: data.title, content: data.content });
    setIsSubmitting(false);
    setIsSubmitting(false);
    
    if (note) {
      navigate('/');
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="gap-2 -ml-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to notes
          </Button>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Create Note
        </h1>
        <p className="text-muted-foreground mt-2">
          Capture a new thought, idea, or important information.
        </p>
      </div>

      <NoteForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Create Note"
        title="New Note"
      />
    </div>
  );
}
