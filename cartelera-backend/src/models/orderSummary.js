export default class OrderSummary {
    constructor ({
        id = null,
        userId,
        items = [],
        billing = {},
        totals = { subtotal: 0, total: 0 },
        paymentMethod = 'bank',
        status = 'paid',
        createdAt = Date.now(),
        updatedAt = Date.now()
    }) {
        this.id = id
        this.userId = userId
        this.items = items
        this.billing = billing
        this.totals = totals
        this.paymentMethod = paymentMethod
        this.status = status
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}
