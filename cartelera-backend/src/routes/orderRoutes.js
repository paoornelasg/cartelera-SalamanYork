import express from 'express'
import OrderController from '../controllers/orderController.js'

const router = express.Router()
const controller = new OrderController()

// Realizar el checkout
router.post('/checkout', controller.checkout.bind(controller))

export default router
