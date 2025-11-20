import MovieService from '../services/movieService.js'

export default class MovieController {
  constructor () {
    this.movieService = new MovieService()
  }

  async create (req, res, next) {
    try {
      const result = await this.movieService.create(req.body, req.file)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
    try {
      const { id } = req.params
      const result = await this.movieService.update(id, req.body, req.file)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }


  async getAll (req, res, next) {
    try {
      const result = await this.movieService.getAll()
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getById (req, res, next) {
    try {
      const { id } = req.params
      const result = await this.movieService.getById(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getByGenre (req, res, next) {
    try {
      const { genre } = req.params
      const result = await this.movieService.getByGenre(genre)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getRecent (req, res, next) {
    try {
      const days = Number(req.params.days || 30)
      const limit = Number(req.query.limit || 12)
      const result = await this.movieService.getRecent({ days, limit })
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getBillboard (req, res, next) {
    try {
      const limit = Number(req.query.limit || 12)
      const result = await this.movieService.getBillboard({ limit })
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}
