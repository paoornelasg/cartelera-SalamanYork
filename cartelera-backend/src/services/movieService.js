import MovieRepository from '../repositories/movieRepository.js'
import Movie from '../models/movie.js'
import { uploadImageToStorage } from '../utils/uploadImage.js'
import { v4 as uuidv4 } from 'uuid'

export default class MovieService {
    constructor () {
        this.movieRepository = new MovieRepository()
    }

    async create (data, file) {
        const id = uuidv4()

        if (!data.title || data.title === '') {
            throw { statusCode: 400, message: 'El campo "title" es obligatorio' }
        }

        if (!file && !data.posterUrl) {
            throw { statusCode: 400, message: 'Debes subir un póster para la película' }
        }

        let posterUrl = data.posterUrl || ''

        if (file) {
            posterUrl = await uploadImageToStorage(file)
        }

        const duration = data.duration ? Number(data.duration) : 0

        let genre = []
        if (Array.isArray(data.genre)) {
            genre = data.genre
        } else if (typeof data.genre === 'string') {
            genre = data.genre
                .split(',')
                .map(g => g.trim())
                .filter(Boolean)
        }

        let actors = []
        if (Array.isArray(data.actors)) {
            actors = data.actors
        } else if (typeof data.actors === 'string') {
            actors = data.actors
            .split(',')
            .map(a => a.trim())
            .filter(Boolean)
        }

        let releaseDate = null
        if (data.releaseDate) {
            const d = new Date(data.releaseDate)
            if (!isNaN(d.getTime())) {
                releaseDate = d.getTime()
            }
        }

        const newMovie = new Movie({
            id,
            ...data,
            genre,
            actors,
            duration,
            releaseDate,
            posterUrl,
            updatedAt: Date.now()
        })

        return await this.movieRepository.create(id, { ...newMovie })
    }

    async update(id, data, file) {
        const existing = await this.movieRepository.getById(id)
        if (!existing) throw { statusCode: 404, message: 'Película no encontrada' }

        if (file) {
            const posterUrl = await uploadImageToStorage(file)
            data.posterUrl = posterUrl
        } else if (data.posterUrl) {
            data.posterUrl = data.posterUrl
        }

        if (data.duration !== undefined) {
            data.duration = Number(data.duration)
        }

        if (data.releaseDate !== undefined && data.releaseDate !== null) {
            const d = new Date(data.releaseDate)
            if (!isNaN(d.getTime())) {
                data.releaseDate = d.getTime()
            } else {
                delete data.releaseDate
            }
        }

        if (data.genre !== undefined) {
            if (Array.isArray(data.genre)) {
            } else if (typeof data.genre === 'string') {
                data.genre = data.genre
                    .split(',')
                    .map(g => g.trim())
                    .filter(Boolean)
            }
        }

        if (data.actors !== undefined) {
            if (Array.isArray(data.actors)) {
            } else if (typeof data.actors === 'string') {
                data.actors = data.actors
                    .split(',')
                    .map(a => a.trim())
                    .filter(Boolean)
            }
        }

        return await this.movieRepository.update(id, {
            ...data,
            updatedAt: Date.now()
        })
    }

    

    async getAll () {
        return await this.movieRepository.getAll()
    }

    async getById (id) {
        const movie = await this.movieRepository.getById(id)
        if (!movie) throw { statusCode: 404, message: 'Película no encontrada' }
        return movie
    }

    async getByGenre (genre) {
        return await this.movieRepository.getByGenre(genre)
    }

    async getRecent (options) {
        return await this.movieRepository.getRecent(options)
    }

    async getBillboard (options) {
        return await this.movieRepository.getBillboard(options)
    }
}
