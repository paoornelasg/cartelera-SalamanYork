import express from 'express'
import ContactController from '../controllers/contactController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()
const controller = new ContactController()

const contactRoutes = [
  {
    method: 'post',
    path: '/',
    middleware: [authMiddleware], //Verifica que el usuario esté autenticado
    handler: 'sendMessage'
  }
]

contactRoutes.forEach(r => {
  const middlewares = r.middleware || []
  router[r.method](r.path, ...middlewares, controller[r.handler].bind(controller))
})

export default router
