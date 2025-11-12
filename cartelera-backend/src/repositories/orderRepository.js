import { db } from '../config/firebase.js'

export default class OrderRepository {
    constructor () {
        this.collection = db.collection('orders')
    }

    async create (id, order) {
        await this.collection.doc(id).set(order)
        return { id, ...order }
    }

    async update (id, order) {
        await this.collection.doc(id).update(order)
        return { id, ...order }
    }

    async getByUser (userId, status = null) {
        let ref = this.collection.where('userId', '==', userId)
        if (status) ref = ref.where('status', '==', status)
        const snap = await ref.get()
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async delete (id) {
        await this.collection.doc(id).delete()
        return { id, message: 'Orden eliminada' }
    }

    async getById (id) {
        const doc = await this.collection.doc(id).get()
        return doc.exists ? { id: doc.id, ...doc.data() } : null
    }
}