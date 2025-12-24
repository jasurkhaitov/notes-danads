import { NoteFormData } from '@/components/NoteForm'
import { useNote, useNotes } from '@/hooks/useNotes'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { LoadingState } from '@/components/LoadingState'
import { EditNoteForm } from '@/components/EditNoteForm'

export default function EditNotePage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { note, loading, error, fetchNote } = useNote(id)
	const { updateNote } = useNotes()
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		if (id) fetchNote()
	}, [id, fetchNote])

	const handleSubmit = async (data: NoteFormData) => {
		if (!id) return
		setIsSubmitting(true)
		const updatedNote = await updateNote(id, data)
		setIsSubmitting(false)
		if (updatedNote) navigate('/')
	}

	if (loading) return <LoadingState message='Loading note...' />

	if (error || !note) {
		return (
			<div className='text-center'>
				<p className='text-destructive'>{error || 'Note not found'}</p>
				<Link to='/'>
					<Button variant='outline'>Back to notes</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className='container py-8 max-w-2xl'>
			<div className='mb-6'>
				<Link to='/'>
					<Button variant='ghost' className='gap-2 -ml-2 mb-4'>
						<ArrowLeft className='h-4 w-4' />
						Back to notes
					</Button>
				</Link>
				<h1 className='text-3xl font-serif font-bold text-foreground'>
					Edit Note
				</h1>
				<p className='text-muted-foreground mt-2'>
					Update your note's title or content.
				</p>
			</div>

			<EditNoteForm
				key={note.id}
				defaultValues={{
					title: note.data.title || '',
					content: note.data.content || '',
				}}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				submitLabel='Save Changes'
				title='Edit Note'
			/>
		</div>
	)
}
