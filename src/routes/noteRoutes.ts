import { Router } from 'express'
import noteController from '../controllers/noteController'
import { asyncHandler } from '../utils/asyncHandler'
import { validate } from '../middlewares/validation'
import {
	createNoteSchema,
	updateNoteSchema,
	queryParamsSchema,
} from '../types/note.types'
import { z } from 'zod'

const router = Router()

const createNoteValidation = z.object({ body: createNoteSchema })
const updateNoteValidation = z.object({ body: updateNoteSchema })
const getNoteByIdValidation = z.object({
	params: z.object({ id: z.string().uuid('Invalid note ID format') }),
})
const getNotesValidation = z.object({ query: queryParamsSchema })

router.post(
	'/post',
	validate(createNoteValidation),
	asyncHandler(noteController.createNote.bind(noteController))
)

router.get(
	'/',
	validate(getNotesValidation),
	asyncHandler(noteController.getNotes.bind(noteController))
)

router.get(
	'/:id',
	validate(getNoteByIdValidation),
	asyncHandler(noteController.getNoteById.bind(noteController))
)

router.put(
	'/:id',
	validate(getNoteByIdValidation),
	validate(updateNoteValidation),
	asyncHandler(noteController.updateNote.bind(noteController))
)

router.delete(
	'/:id',
	validate(getNoteByIdValidation),
	asyncHandler(noteController.deleteNote.bind(noteController))
)

export default router;