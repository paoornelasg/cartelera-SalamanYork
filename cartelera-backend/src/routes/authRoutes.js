import express from 'express'
import authController from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()
const controller = new authController()

const authRoutes = [
    {
        method: 'post',
        path: '/login',
        handler: 'login'
    },

    {
        method: 'post',
        path: '/logout',
        middleware: [
            authMiddleware
        ],
        handler: 'logout'
    },

    //Registrar con correo
    {
        method: 'post',
        path: '/register',
        handler: 'registerEmailOnly'
    },

    //Completar registro con datos adicionales
    {
        method: 'post',
        path: '/complete-register',
        handler: 'completeRegister'
    },

]

authRoutes.forEach(route => {
    const { method, path, middleware = [], handler } = route
    const handlerFunction = controller[handler].bind(controller)

    if (middleware.length > 0) {
        router[method](path, ...middleware, handlerFunction)
    } else {
        router[method](path, handlerFunction)
    }
})

export default router
