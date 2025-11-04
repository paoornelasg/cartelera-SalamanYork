import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/index.js'
import errorMiddleware from './middlewares/errorMiddleware.js'

dotenv.config()

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cors())
app.use('/api', router) 
app.use(errorMiddleware)

const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT} 🐚`)
})
