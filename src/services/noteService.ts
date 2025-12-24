import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import {
	Note,
	CreateNoteDto,
	UpdateNoteDto,
	QueryParams,
	PaginatedResponse,
} from '../types/note.types'
import { AppError } from '../middlewares/errorHandler'

class NoteService {
	private notes: Note[] = []
	private dataPath = path.join(__dirname, '../../data/notes.json')
	private initialized = false

	async initialize(): Promise<void> {
		if (this.initialized) return

		try {
			await fs.mkdir(path.dirname(this.dataPath), { recursive: true })
			const data = await fs.readFile(this.dataPath, 'utf-8')
			this.notes = JSON.parse(data)
			console.log(`Loaded ${this.notes.length} notes from storage`)
		} catch (error) {
			this.notes = []
			await this.saveNotes()
			console.log('Initialized empty notes storage')
		}

		this.initialized = true
	}

	private async saveNotes(): Promise<void> {
		await fs.writeFile(this.dataPath, JSON.stringify(this.notes, null, 2))
	}

	async createNote(data: CreateNoteDto): Promise<Note> {
		const note: Note = {
			id: uuidv4(),
			title: data.title,
			content: data.content,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		this.notes.push(note)
		await this.saveNotes()
		return note
	}

	async getNotes(params: QueryParams): Promise<PaginatedResponse<Note>> {
		let filteredNotes = [...this.notes]

		if (params.search) {
			const searchLower = params.search.toLowerCase()
			filteredNotes = filteredNotes.filter(
				note =>
					note.title.toLowerCase().includes(searchLower) ||
					note.content.toLowerCase().includes(searchLower)
			)
		}

		const page = Number(params.page) || 1
		const limit = Number(params.limit) || 10

		const startIndex = (page - 1) * limit
		const endIndex = startIndex + limit

		const paginatedNotes = filteredNotes.slice(startIndex, endIndex)

		return {
			data: paginatedNotes,
			pagination: {
				page,
				limit,
				total: filteredNotes.length,
				totalPages: Math.ceil(filteredNotes.length / limit),
			},
		}
	}

	async getNoteById(id: string): Promise<Note> {
		const note = this.notes.find(n => n.id === id)
		if (!note) {
			throw new AppError(404, `Note with id ${id} not found`)
		}
		return note
	}

	async updateNote(id: string, data: UpdateNoteDto): Promise<Note> {
		const index = this.notes.findIndex(n => n.id === id)
		if (index === -1) {
			throw new AppError(404, `Note with id ${id} not found`)
		}

		const updatedNote: Note = {
			...this.notes[index],
			...(data.title && { title: data.title }),
			...(data.content && { content: data.content }),
			updatedAt: new Date().toISOString(),
		}

		this.notes[index] = updatedNote
		await this.saveNotes()
		return updatedNote
	}

	async deleteNote(id: string): Promise<void> {
		const index = this.notes.findIndex(n => n.id === id)
		if (index === -1) {
			throw new AppError(404, `Note with id ${id} not found`)
		}

		this.notes.splice(index, 1)
		await this.saveNotes()
	}
}

export default new NoteService()