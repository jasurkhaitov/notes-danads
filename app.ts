import express, { Express } from 'express'
import dotenv from 'dotenv'
import noteRoutes from './src/routes/noteRoutes'
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler'
import noteService from './src/services/noteService'
import cors from 'cors'

dotenv.config({ quiet: true })

const app: Express = express()
const PORT = process.env.PORT || 3000

app.use(
	cors({
		origin: 'http://localhost:8080',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/notes', noteRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

const startServer = async (): Promise<void> => {
	try {
		await noteService.initialize()
		app.listen(PORT, () => {
			console.log(`OOPs | Server is running on http://localhost:${PORT}`)
		})
	} catch (error) {
		console.error('Failed to start server:', error)
		process.exit(1)
	}
}

startServer()

export default app