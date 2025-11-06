import express from 'express'
import multer from 'multer'
import MovieController from '../controllers/movieController.js'

// Define las rutas para el manejo de películas
const router = express.Router()
const controller = new MovieController()
const upload = multer({ storage: multer.memoryStorage() })

const movieRoutes = [
  {
    method: 'post',
    path: '/create',
    middleware: [upload.single('poster')],
    handler: 'create'
  },
  {
    method: 'put',
    path: '/update/:id',
    middleware: [upload.single('poster')],
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
    path: '/genre/:genre',
    handler: 'getByGenre'
  },
  {
    method: 'get',
    path: '/recent',
    handler: 'getRecent'
  },
  {
    method: 'get',
    path: '/recent/:days',
    handler: 'getRecent'
  },
  {
    method: 'get',
    path: '/billboard',
    handler: 'getBillboard'
  },
  {
    method: 'get',
    path: '/:id',
    handler: 'getById'
  }
]

movieRoutes.forEach(route => {
  router[route.method](
    route.path,
    ...(route.middleware || []),
    controller[route.handler].bind(controller)
  )
})

export default router


