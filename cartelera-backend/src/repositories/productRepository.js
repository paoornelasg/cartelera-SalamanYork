import { db } from '../config/firebase.js'

export default class ProductRepository {
  constructor () {
    this.collection = db.collection('products')
  }

  async create (id, product) {
    await this.collection.doc(id).set(product)
    return { id, ...product }
  }

  async update (id, product) {
    await this.collection.doc(id).update(product)
    return { id, ...product }
  }

  async delete (id) {
    await this.collection.doc(id).delete()
    return { id, message: 'Producto eliminado' }
  }

  async getAll () {
    const snapshot = await this.collection.get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  async getById (id) {
    const doc = await this.collection.doc(id).get()
    return doc.exists ? { id: doc.id, ...doc.data() } : null
  }

  async getByCategory (category) {
    const snapshot = await this.collection.where('category', '==', category).get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
}
