export default class Order {
    constructor ({
        id = null,
        userId,
        movieId,
        movieTitle = '',
        cinema,
        showDate,
        showTime,
        qty = 1,
        unitPrice = 0,
        subtotal = 0,
        status= 'cart',
        createdAt = Date.now(),
        updatedAt = Date.now()
    }) {
        this.id = id
        this.userId = userId
        this.movieId = movieId
        this.movieTitle = movieTitle
        this.cinema = cinema
        this.showDate = showDate
        this.showTime = showTime
        this.qty = qty
        this.unitPrice = unitPrice
        this.subtotal = subtotal
        this.status = status
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}