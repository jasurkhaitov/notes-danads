import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export class AppError extends Error {
	constructor(
		public statusCode: number,
		public message: string,
		public isOperational = true
	) {
		super(message)
		Object.setPrototypeOf(this, AppError.prototype)
	}
}

export const errorHandler = (
	err: Error | AppError | ZodError,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	let statusCode = 500
	let message = 'Internal Server Error'
	let error: string | undefined

	if (err instanceof AppError) {
		statusCode = err.statusCode
		message = err.message
	} else if (err instanceof ZodError) {
		statusCode = 400
		message = 'Validation Error'
		error = err.issues[0]?.message ?? 'Invalid request data'
	} else {
		console.error('Unexpected Error:', err)
		if (process.env.NODE_ENV === 'development') {
			message = err.message
		}
	}

	res.status(statusCode).json({
		success: false,
		message,
		...(error && { error }),
	})
}

export const notFoundHandler = (req: Request, res: Response): void => {
	res.status(404).json({
		success: false,
		message: `Route ${req.originalUrl} not found`,
	})
}
