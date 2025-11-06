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

        const releaseDate = data.releaseDate ? Number(data.releaseDate) : null

        const newMovie = new Movie({
            id,
            ...data,
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
            data.releaseDate = Number(data.releaseDate)
        }

        return await this.movieRepository.update(id, {
            ...data,
            updatedAt: Date.now()
        })
    }

    async delete (id) {
        return await this.movieRepository.delete(id)
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
