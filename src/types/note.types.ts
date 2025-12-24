import { z } from 'zod'

export const createNoteSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters'),
	content: z.string().min(1, 'Content is required'),
})

export const updateNoteSchema = z
	.object({
		title: z
			.string()
			.min(3, 'Title must be at least 3 characters')
			.optional(),
		content: z.string().min(1, 'Content is required').optional(),
	})
	.refine(data => data.title !== undefined || data.content !== undefined, {
		message: 'At least one field (title or content) must be provided',
	})

export const queryParamsSchema = z.object({
	page: z.string().regex(/^\d+$/).transform(Number).optional(),
	limit: z.string().regex(/^\d+$/).transform(Number).optional(),
	search: z.string().optional(),
})

export interface Note {
	id: string
	title: string
	content: string
	createdAt: string
	updatedAt: string
}

export type CreateNoteDto = z.infer<typeof createNoteSchema>
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>
export type QueryParams = z.infer<typeof queryParamsSchema>

export interface PaginatedResponse<T> {
	data: T[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}