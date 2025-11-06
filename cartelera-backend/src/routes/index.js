import express from 'express'
import userRoutes from './userRoutes.js'
import authRoutes from './authRoutes.js'
import movieRoutes from './movieRoutes.js'
import orderRoutes from './orderRoutes.js'

const router = express.Router()

router.use('/users', userRoutes)
router.use('/movies', movieRoutes)
router.use('/orders', orderRoutes)
router.use('/auth', authRoutes)

export default router
