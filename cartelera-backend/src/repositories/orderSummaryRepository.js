import { db } from '../config/firebase.js'

export default class OrderSummaryRepository {
    constructor () {
        this.collection = db.collection('ordersSummary')
    }

    async create (id, orderSummary) {
        await this.collection.doc(id).set(orderSummary)
        return { id, ...orderSummary }
    }

    async getById (id) {
        const doc = await this.collection.doc(id).get()
        return doc.exists ? { id: doc.id, ...doc.data() } : null
    }

    async getByUser (userId) {
        const snapshot = await this.collection.where('userId', '==', userId).get()
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }
}
