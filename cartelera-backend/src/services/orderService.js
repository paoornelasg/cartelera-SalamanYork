import { db } from '../config/firebase.js'

// Datos para realizar la orden por parte del usuario
export default class OrderService {
    async createOrder (data) {
        const order = {
            billing: data.billing,
            cart: data.cart,
            totals: data.totals,
            paymentMethod: data.paymentMethod,
            notes: data.notes || '',
            status: 'pending',
            createdAt: new Date()
        }

        const doc = await db.collection('orders').add(order)
        return { id: doc.id }
    }
}
