import ProductService from '../services/productService.js'

export default class ProductController {
  constructor () {
    this.productService = new ProductService()
  }

  async create (req, res, next) {
    try {
      const result = await this.productService.create(req.body, req.file)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
    try {
      const { id } = req.params
      const result = await this.productService.update(id, req.body, req.file)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      const { id } = req.params
      const result = await this.productService.delete(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getAll (req, res, next) {
    try {
      const result = await this.productService.getAll()
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getById (req, res, next) {
    try {
      const { id } = req.params
      const result = await this.productService.getById(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getByCategory (req, res, next) {
    try {
      const { category } = req.params
      const result = await this.productService.getByCategory(category)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}
