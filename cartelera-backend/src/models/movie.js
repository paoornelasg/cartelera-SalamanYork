export default class Movie {
  constructor ({
      id = null,
      title,
      synopsis = '',
      genre = [],
      rating = 'PG',
      duration = 0,
      language = 'Inglés',
      format = 'Tradicional',
      posterUrl = '',
      trailerUrl = '',
      director = '',
      actors = [],
      isBillboard = false,
      releaseDate = null,
      createdAt = Date.now(),
      updatedAt = Date.now()
    }) {
      this.id = id
      this.title = title
      this.synopsis = synopsis
      this.genre = genre
      this.rating = rating
      this.duration = duration
      this.language = language
      this.format = format
      this.posterUrl = posterUrl
      this.trailerUrl = trailerUrl
      this.director = director
      this.actors = actors
      this.isBillboard = isBillboard
      this.releaseDate = releaseDate
      this.createdAt = createdAt
      this.updatedAt = updatedAt
    }
}