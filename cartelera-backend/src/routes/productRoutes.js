import express from 'express'
import multer from 'multer'
import ProductController from '../controllers/productController.js'

// Define las rutas para el manejo de productos
const router = express.Router()
const controller = new ProductController()
const upload = multer({ storage: multer.memoryStorage() })

const productRoutes = [
  {
    method: 'post',
    path: '/create',
    middleware: [upload.single('image')],
    handler: 'create'
  },
  {
    method: 'put',
    path: '/update/:id',
    middleware: [upload.single('image')],
    handler: 'update'
  },
  {
    method: 'delete',
    path: '/delete/:id',
    // middleware: [authMiddleware, roleMiddleware('admin')],
    handler: 'delete'
  },
  {
    method: 'get',
    path: '/',
    handler: 'getAll'
  },
  {
    method: 'get',
    path: '/category/:category',
    handler: 'getByCategory'
  },
  {
    method: 'get',
    path: '/:id',
    handler: 'getById'
  }
]

productRoutes.forEach(route => {
  router[route.method](
    route.path,
    ...(route.middleware || []),
    controller[route.handler].bind(controller)
  )
})

export default router


