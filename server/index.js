import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import careerRoutes from './routes/career.js'
import interviewRoutes from './routes/interview.js'
import schemeRoutes from './routes/schemes.js'
import collegeRoutes from './routes/colleges.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/career', careerRoutes)
app.use('/api/interview', interviewRoutes)
app.use('/api/schemes', schemeRoutes)
app.use('/api/colleges', collegeRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'PathFinder API is running 🚀', timestamp: new Date().toISOString() })
})

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.warn('⚠️  Running without DB — auth routes will not work')
  }
  app.listen(PORT, () => {
    console.log(`🚀 PathFinder server running on port ${PORT}`)
  })
}

startServer()
