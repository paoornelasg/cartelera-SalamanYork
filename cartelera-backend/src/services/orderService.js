import OrderRepository from '../repositories/orderRepository.js'
import Order from '../models/order.js'
import { v4 as uuidv4 } from 'uuid'

export default class OrderService {
    constructor () {
        this.orderRepository = new OrderRepository()
    }

    async addToCart (data, currentUser) {
        const userId = data.userId || currentUser?.id || data.usuario || null

        if (!userId || !data.movieId || !data.cinema || !data.showDate || !data.showTime || !data.qty || !data.unitPrice) {
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
        const updates = await Promise.all(items.map(it => this.orderRepository.update(it.id, { status: 'paid', updatedAt: Date.now() })))
        return { ok: true, items: updates }
    }
}
