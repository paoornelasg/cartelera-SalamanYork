import OrderRepository from '../repositories/orderRepository.js'
import Order from '../models/orderFuncion.js'
import { v4 as uuidv4 } from 'uuid'

export default class OrderService {
    constructor () {
        this.orderRepository = new OrderRepository()
    }

    async addToCart (data, currentUser) {
        const userId = data.userId || currentUser?.id || data.usuario || null

        // "!userId ||" es opcional para que los invitados puedan agregar al carrito; se requieren los otros campos
        if (!data.movieId || !data.cinema || !data.showDate || !data.showTime || !data.qty || !data.unitPrice) {
            throw { statusCode: 400, message: 'Faltan campos requeridos' }
        }

        const id = uuidv4()
        const qty = Number(data.qty)
        const unitPrice = Number(data.unitPrice)
        const subtotal = qty * unitPrice

        const order = new Order({
        id,
        userId,
        movieId: data.movieId,
        movieTitle: data.movieTitle || '',
        poster: data.poster || data.image || data.moviePoster || '',
        cinema: data.cinema,
        showDate: Number(data.showDate),
        showTime: data.showTime,
        qty,
        unitPrice,
        subtotal,
        status: 'cart'
        })

        return await this.orderRepository.create(id, { ...order })
    }

    async getCart (userId) {
        return await this.orderRepository.getByUser(userId, 'cart')
    }

    async updateItem (id, data) {
        const existing = await this.orderRepository.getById(id)
        if (!existing) throw { statusCode: 404, message: 'Item no encontrado' }

        const qty = data.qty ? Number(data.qty) : existing.qty
        const unitPrice = data.unitPrice ? Number(data.unitPrice) : existing.unitPrice
        const updated = {
        ...existing,
        ...data,
        qty,
        unitPrice,
        subtotal: qty * unitPrice,
        updatedAt: Date.now()
        }
        
        return await this.orderRepository.update(id, updated)
    }

    async removeItem (id) {
        return await this.orderRepository.delete(id)
    }

    async checkout (userId) {
        const items = await this.getCart(userId)
        // Usa el repositorio transaccional para decrementar la disponibilidad y marcar los pedidos como pagados
        return await this.orderRepository.processCheckout(userId, items)
    }

    async getShowAvailability (movieId, cinema, showDate, showTime) {
        if (!movieId || !cinema || !showDate || !showTime) throw { statusCode: 400, message: 'Faltan parámetros para disponibilidad' }
        return await this.orderRepository.getShowAvailability(movieId, cinema, showDate, showTime)
    }

    async cleanupExpiredCarts (opts = {}) {
        return await this.orderRepository.expireOldCartItems(opts)
    }
}
