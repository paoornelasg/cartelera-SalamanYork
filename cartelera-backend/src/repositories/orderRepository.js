import { db } from '../config/firebase.js'

// minutos para considerar un artículo del carrito como reservado antes de expirar
const CART_TTL_MINUTES = Number(process.env.CART_TTL_MINUTES) || 30

export default class OrderRepository {
    constructor () {
        this.collection = db.collection('orders')
    }

    async create (id, order) {
        const now = Date.now()
        if (!order.createdAt) order.createdAt = now
        if (!order.updatedAt) order.updatedAt = now
        await this.collection.doc(id).set(order)
        return { id, ...order }
    }

    // Busca un ítem de carrito existente para el mismo usuario y función (si aún no expiró)
    async findCartItem (userId, movieId, cinema, showDate, showTime) {
        if (!userId) return null

        let ref = this.collection
            .where('userId', '==', userId)
            .where('movieId', '==', movieId)
            .where('cinema', '==', cinema)
            .where('showDate', '==', showDate)
            .where('showTime', '==', showTime)
            .where('status', '==', 'cart')

        const snap = await ref.get()
        if (snap.empty) return null

        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))

        const expiryMs = CART_TTL_MINUTES * 60 * 1000
        const cutoff = Date.now() - expiryMs
        const valid = docs.filter(d => Number(d.createdAt || 0) >= cutoff)
        return valid.length ? valid[0] : null
    }

    async update (id, order) {
        await this.collection.doc(id).update(order)
        return { id, ...order }
    }

    async getByUser (userId, status = null) {
        if (!userId) return []

        let ref = this.collection.where('userId', '==', userId)
        if (status) ref = ref.where('status', '==', status)

        const snap = await ref.get()
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))

        // Si se están devolviendo artículos del carrito, filtrar las entradas expiradas en memoria para evitar requisitos de índice
        if (status === 'cart') {
            const expiryMs = CART_TTL_MINUTES * 60 * 1000
            const cutoff = Date.now() - expiryMs
            return docs.filter(d => Number(d.createdAt || 0) >= cutoff)
        }

        return docs
    }

    async delete (id) {
        await this.collection.doc(id).delete()
        return { id, message: 'Orden eliminada' }
    }

    async getById (id) {
        const doc = await this.collection.doc(id).get()
        return doc.exists ? { id: doc.id, ...doc.data() } : null
    }

    // Construye un ID de documento determinista para un show específico (película + cine + fecha + hora)
    getShowDocId (movieId, cinema, showDate, showTime) {
        const safe = (v) => String(v).toLowerCase().replace(/[^a-z0-9-_]/g, '_')
        return `${safe(movieId)}_${safe(cinema)}_${safe(showDate)}_${safe(showTime)}`
    }

    async processCheckout (userId, items) {
        // items: arreglo de elementos de pedido en el carrito para este usuario
        if (!items || items.length === 0) return { ok: true, items: [] }

        // Agrupar cantidades por función
        const groups = {}
        for (const it of items) {
            const key = this.getShowDocId(it.movieId, it.cinema, it.showDate, it.showTime)
            groups[key] = groups[key] || { movieId: it.movieId, cinema: it.cinema, showDate: it.showDate, showTime: it.showTime, qty: 0, items: [] }
            groups[key].qty += Number(it.qty)
            groups[key].items.push(it)
        }

        const results = []

        // Generar un purchaseId único para esta transacción de compra
        const purchaseId = `purchase_${Date.now()}_${Math.random().toString(36).slice(2,8)}`

        await db.runTransaction(async (tx) => {
            // Primero: leer todos los documentos de disponibilidad necesarios
            const showKeys = Object.keys(groups)
            const showSnaps = {}
            for (const key of showKeys) {
                const showRef = db.collection('showAvailability').doc(key)
                showSnaps[key] = await tx.get(showRef)
            }

            // Segundo: validar disponibilidad y luego realizar las escrituras (sets/updates)
            for (const key of showKeys) {
                const g = groups[key]
                const showRef = db.collection('showAvailability').doc(key)
                const showSnap = showSnaps[key]
                let capacity = 50
                let sold = 0
                if (!showSnap.exists) {
                    // crear documento de disponibilidad por defecto
                    tx.set(showRef, { capacity, sold: 0, createdAt: Date.now(), updatedAt: Date.now() })
                } else {
                    const data = showSnap.data()
                    capacity = Number(data.capacity) || 50
                    sold = Number(data.sold) || 0
                }

                const available = capacity - sold
                if (available < g.qty) {
                    throw { statusCode: 400, message: `No hay suficientes boletos disponibles para ${g.movieId} ${g.showDate} ${g.showTime}` }
                }

                // actualizar el conteo de vendidos
                tx.update(showRef, { sold: sold + g.qty, updatedAt: Date.now() })

                // marcar cada elemento de pedido de este grupo como pagado
                for (const it of g.items) {
                    const orderRef = this.collection.doc(it.id)
                    const paidAt = Date.now()
                    tx.update(orderRef, { status: 'paid', purchaseId, paidAt, updatedAt: paidAt })
                    results.push({ id: it.id, status: 'paid', purchaseId, paidAt })
                }
            }
        })

        return { ok: true, items: results }
    }

    async getShowAvailability (movieId, cinema, showDate, showTime) {
        const id = this.getShowDocId(movieId, cinema, showDate, showTime)
        const ref = db.collection('showAvailability').doc(id)
        const snap = await ref.get()
        if (!snap.exists) {
            const capacity = 50
            const sold = 0
            // contar cantidad pendiente en el carrito desde la colección de órdenes
            const expiryMs = CART_TTL_MINUTES * 60 * 1000
            const cutoff = Date.now() - expiryMs
            const pendingSnap = await this.collection
                .where('movieId', '==', movieId)
                .where('cinema', '==', cinema)
                .where('showDate', '==', showDate)
                .where('showTime', '==', showTime)
                .where('status', '==', 'cart')
                .get()
            const pending = pendingSnap.docs
                .map(d => d.data())
                .filter(d => Number(d.createdAt || 0) >= cutoff)
                .reduce((s, d) => s + (Number(d.qty) || 0), 0)
            return { capacity, sold, pending, available: Math.max(0, capacity - sold - pending) }
        }
        const data = snap.data()
        const capacity = Number(data.capacity) || 50
        const sold = Number(data.sold) || 0
        // contar cantidad pendiente en el carrito desde la colección de órdenes y restar de disponible
        const expiryMs = CART_TTL_MINUTES * 60 * 1000
        const cutoff = Date.now() - expiryMs
        const pendingSnap = await this.collection
            .where('movieId', '==', movieId)
            .where('cinema', '==', cinema)
            .where('showDate', '==', showDate)
            .where('showTime', '==', showTime)
            .where('status', '==', 'cart')
            .get()
        const pending = pendingSnap.docs
            .map(d => d.data())
            .filter(d => Number(d.createdAt || 0) >= cutoff)
            .reduce((s, d) => s + (Number(d.qty) || 0), 0)
        return { capacity, sold, pending, available: Math.max(0, capacity - sold - pending) }
    }

    // Encuentra elementos del carrito más antiguos que el TTL y se marcan como 'expirados'
    async expireOldCartItems ({ dryRun = false, limit = 500 } = {}) {
        const expiryMs = CART_TTL_MINUTES * 60 * 1000
        const cutoff = Date.now() - expiryMs

        const q = this.collection
            .where('status', '==', 'cart')
            .where('createdAt', '<', cutoff)
            .limit(limit)

        const snap = await q.get()
        const ids = snap.docs.map(d => d.id)

        if (dryRun) return { count: ids.length, ids }

        if (ids.length === 0) return { count: 0, ids: [] }

        // Elimina órdenes de carrito expiradas para liberar disponibilidad y evitar acumular documentos obsoletos
        const batch = db.batch()
        for (const doc of snap.docs) {
            const ref = this.collection.doc(doc.id)
            batch.delete(ref)
        }

        await batch.commit()
        return { count: ids.length, ids }
    }
}