import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const noteSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, 'Title is required')
		.max(100, 'Title must be less than 100 characters'),
	content: z
		.string()
		.trim()
		.min(1, 'Content is required')
		.max(10000, 'Content must be less than 10,000 characters'),
})

export type NoteFormData = z.infer<typeof noteSchema>

interface NoteFormProps {
	defaultValues?: NoteFormData
	onSubmit: (data: NoteFormData) => Promise<void>
	isSubmitting?: boolean
	submitLabel?: string
	title?: string
}

export function EditNoteForm({
	defaultValues = { title: '', content: '' },
	onSubmit,
	isSubmitting,
	submitLabel = 'Save Note',
	title = 'Note',
}: NoteFormProps) {
	const form = useForm<NoteFormData>({
		resolver: zodResolver(noteSchema),
		defaultValues,
	})

	useEffect(() => {
		form.reset(defaultValues)
	}, [defaultValues, form])

	const handleSubmit = async (data: NoteFormData) => {
		await onSubmit(data)
	}

	console.log(defaultValues);
	

	return (
		<Card className='note-card-shadow animate-fade-in'>
			<CardHeader>
				<CardTitle className='text-2xl font-serif'>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-6'
					>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-foreground font-medium'>
										Title
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter a title for your note...'
											className='h-11 bg-background border-border focus-visible:ring-primary/20'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='content'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-foreground font-medium'>
										Content
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Write your note content here...'
											className='min-h-[200px] resize-y bg-background border-border focus-visible:ring-primary/20'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='flex justify-end gap-3 pt-2'>
							<Button
								type='button'
								variant='outline'
								onClick={() => form.reset()}
								disabled={isSubmitting}
							>
								Reset
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								)}
								{submitLabel}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
