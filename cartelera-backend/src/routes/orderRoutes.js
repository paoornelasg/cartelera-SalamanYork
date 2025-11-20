import express from 'express'
import OrderController from '../controllers/orderController.js'

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
        handler: 'checkout' 
    }
]

orderRoutes.forEach(r => {
  router[r.method](r.path, controller[r.handler].bind(controller))
})

export default router
