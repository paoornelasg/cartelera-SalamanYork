import { db } from '../config/firebase.js'

export default class MovieRepository {
  constructor () {
    this.collection = db.collection('movies')
  }

  // Crear película
  async create (id, movie) {
    await this.collection.doc(id).set(movie)
    return { id, ...movie }
  }

  // Actualizar película
  async update (id, movie) {
    await this.collection.doc(id).update(movie)
    return { id, ...movie }
  }

  

  // Obtener todas
  async getAll () {
    const snapshot = await this.collection.get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // Obtener por ID de película
  async getById (id) {
    const doc = await this.collection.doc(id).get()
    return doc.exists ? { id: doc.id, ...doc.data() } : null
  }

  // Obtener por género de película
  async getByGenre (genre) {
    const snapshot = await this.collection.where('genre', 'array-contains', genre).get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // Obtener los recientes para cartelera
  async getRecent ({ days = 30, limit = 12 } = {}) {
    const from = Date.now() - days * 24 * 60 * 60 * 1000
    const q = await this.collection
      .where('releaseDate', '>=', from)
      .orderBy('releaseDate', 'desc')
      .limit(limit)
      .get()
    return q.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // Obtener cartelera
  async getBillboard ({ limit = 12 } = {}) {
    const q = await this.collection
      .where('isBillboard', '==', true)
      .orderBy('updatedAt', 'desc')
      .limit(limit)
      .get()
    return q.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
}
