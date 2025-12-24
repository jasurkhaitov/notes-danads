import { Request, Response } from 'express'
import noteService from '../services/noteService'
import { CreateNoteDto, UpdateNoteDto, QueryParams } from '../types/note.types'

export class NoteController {
	async createNote(req: Request, res: Response): Promise<void> {
		const data: CreateNoteDto = req.body
		const note = await noteService.createNote(data)

		res.status(201).json({
			success: true,
			message: 'Note created successfully',
			data: note,
		})
	}

	async getNotes(req: Request, res: Response): Promise<void> {
		const params: QueryParams = req.query
		const result = await noteService.getNotes(params)

		res.status(200).json({
			success: true,
			message: 'Notes retrieved successfully',
			...result,
		})
	}

	async getNoteById(req: Request, res: Response): Promise<void> {
		const { id } = req.params
		const note = await noteService.getNoteById(id)

		res.status(200).json({
			success: true,
			message: 'Note retrieved successfully',
			data: note,
		})
	}

	async updateNote(req: Request, res: Response): Promise<void> {
		const { id } = req.params
		const data: UpdateNoteDto = req.body
		const note = await noteService.updateNote(id, data)

		res.status(200).json({
			success: true,
			message: 'Note updated successfully',
			data: note,
		})
	}

	async deleteNote(req: Request, res: Response): Promise<void> {
		const { id } = req.params
		await noteService.deleteNote(id)

		res.status(200).json({
			success: true,
			message: 'Note deleted successfully',
		})
	}
}

export default new NoteController()