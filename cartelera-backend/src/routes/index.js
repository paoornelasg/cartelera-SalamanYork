import express from 'express'
import userRoutes from './userRoutes.js'
import authRoutes from './authRoutes.js'
import productRoutes from './productRoutes.js'
import orderRoutes from './orderRoutes.js'

const router = express.Router()

router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)
router.use('/auth', authRoutes)

export default router
