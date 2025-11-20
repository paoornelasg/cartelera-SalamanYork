import OrderService from '../services/orderService.js'

export default class OrderController {
    constructor () {
        this.orderService = new OrderService()
    }

    async addToCart (req, res, next) {
        try {
            const result = await this.orderService.addToCart(req.body, req.user) // req.user si usas auth
            res.status(201).json(result)
        } catch (e) {
        res.status(e.statusCode || 500).json({ message: e.message })
        }
    }

    async getShowAvailability (req, res, next) {
        try {
            const { movieId, cinema, showDate, showTime } = req.query
            if (!movieId || !cinema || !showDate || !showTime) {
                return res.status(400).json({ message: 'Missing query parameters' })
            }
            const result = await this.orderService.getShowAvailability(movieId, cinema, Number(showDate), showTime)
            res.json(result)
        } catch (e) {
            res.status(e.statusCode || 500).json({ message: e.message })
        }
    }

    async getCart (req, res, next) {
        try {
            const userId = req.params.userId || req.user?.id
            const items = await this.orderService.getCart(userId)
            res.json(items)
        } catch (e) {
            res.status(e.statusCode || 500).json({ message: e.message })
        }
    }

    async updateItem (req, res, next) {
        try {
            const { id } = req.params
            const result = await this.orderService.updateItem(id, req.body)
            res.json(result)
        } catch (e) {
            res.status(e.statusCode || 500).json({ message: e.message })
        }
    }

    async cleanupExpiredCarts (req, res, next) {
        try {
            const { dryRun, limit } = req.body || {}
            const result = await this.orderService.cleanupExpiredCarts({ dryRun: Boolean(dryRun), limit: limit ? Number(limit) : undefined })
            res.json(result)
        } catch (e) {
            res.status(e.statusCode || 500).json({ message: e.message })
        }
    }

    async removeItem (req, res, next) {
        try {
            const { id } = req.params
            const result = await this.orderService.removeItem(id)
            res.json(result)
        } catch (e) {
            res.status(e.statusCode || 500).json({ message: e.message })
        }
    }

    async checkout (req, res, next) {
        try {
            const userId = req.body.userId || req.user?.id
            const result = await this.orderService.checkout(userId)
            res.json(result)
        } catch (e) {
            res.status(e.statusCode || 500).json({ message: e.message })
        }
    }
}
