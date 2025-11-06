export default class Movie {
  constructor ({
      id = null,
      title,
      synopsis = '',
      genre = [],
      rating = 'PG',
      duration = 0,
      posterUrl = '',
      trailerUrl = '',
      releaseDate = null,
      isBillboard = false,
      createdAt = Date.now(),
      updatedAt = Date.now()
    }) {
      this.id = id
      this.title = title
      this.synopsis = synopsis
      this.genre = genre
      this.rating = rating
      this.duration = duration
      this.posterUrl = posterUrl
      this.trailerUrl = trailerUrl
      this.releaseDate = releaseDate
      this.isBillboard = isBillboard
      this.createdAt = createdAt
      this.updatedAt = updatedAt
    }
}
