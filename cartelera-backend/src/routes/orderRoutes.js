import express from 'express'
import OrderController from '../controllers/orderController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()
const controller = new OrderController()

const orderRoutes = [
    { 
        method: 'post',   
        path: '/cart/add',       
        handler: 'addToCart' 
    },
    {
        method: 'get',
        path: '/shows/availability',
        handler: 'getShowAvailability'
    },
    {
        method: 'post', // Ruta para hacer limpieza manual de carritos expirados (postman)
        path: '/cart/cleanup',
        handler: 'cleanupExpiredCarts'
    },
    { 
        method: 'get',    
        path: '/cart/user/:userId',  
        handler: 'getCart' 
    },
    {
        method: 'get',
        path: '/user/:userId',
        handler: 'getOrdersByUser'
    },
    { 
        method: 'put',    
        path: '/cart/item/:id',  
        handler: 'updateItem' 
    },
    { 
        method: 'delete', 
        path: '/cart/item/:id',  
        handler: 'removeItem' 
    },
    { 
        method: 'post',   
        path: '/checkout',
        middleware: [authMiddleware],       
        handler: 'checkout' 
    }
]

orderRoutes.forEach(r => {
    const middlewares = r.middleware || []
    router[r.method](
        r.path,
        ...middlewares,
        controller[r.handler].bind(controller)
    )
})

export default router
