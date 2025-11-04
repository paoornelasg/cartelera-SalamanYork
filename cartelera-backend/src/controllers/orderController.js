import OrderService from '../services/orderService.js'

// Realizar el checkout y crear la orden del usuario
export default class OrderController {
    constructor () {
        this.orderService = new OrderService()
    }

    async checkout (req, res, next) {
        try {
            const result = await this.orderService.createOrder(req.body)
            res.status(201).json({ message: 'Orden creada', orderId: result.id })
        } catch (error) {
            next(error)
        }
    }
}
