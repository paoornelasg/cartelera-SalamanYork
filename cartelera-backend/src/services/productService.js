import ProductRepository from '../repositories/productRepository.js'
import Product from '../models/product.js'
import { uploadImageToStorage } from '../utils/uploadImage.js'
import { v4 as uuidv4 } from 'uuid'

export default class ProductService {
    constructor () {
        this.productRepository = new ProductRepository()
    }

    async create (data, file) {
        const id = uuidv4()

        if (!data.name || data.name === '') {
            throw { statusCode: 400, message: 'El campo "name" es obligatorio' }
        }

        if (!data.price || data.price === '') {
            throw { statusCode: 400, message: 'El campo "price" es obligatorio' }
        }

        if (!data.category || data.category === '') {
            throw { statusCode: 400, message: 'El campo "category" es obligatorio' }
        }

        if (!data.stock || data.stock === '') {
            throw { statusCode: 400, message: 'El campo "stock" es obligatorio' }
        }

        if (!file) {
            throw { statusCode: 400, message: 'Debes subir una imagen del producto' }
        }

        const imageUrl = await uploadImageToStorage(file)

        const newProduct = new Product({
            id,
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
            image: imageUrl
        })

        return await this.productRepository.create(id, { ...newProduct })
    }

    async update(id, data, file) {
        const existing = await this.productRepository.getById(id)
        if (!existing) throw { statusCode: 404, message: 'Producto no encontrado' }

        if (file) {
            const imageUrl = await uploadImageToStorage(file)
            data.image = imageUrl
        } else if (data.imageUrl) {
            data.image = data.imageUrl
        }

        return await this.productRepository.update(id, {
            ...data,
            price: Number(data.price),
            stock: Number(data.stock)
        })
    }

    async delete (id) {
        return await this.productRepository.delete(id)
    }

    async getAll () {
        return await this.productRepository.getAll()
    }

    async getById (id) {
        const product = await this.productRepository.getById(id)
        if (!product) throw { statusCode: 404, message: 'Producto no encontrado' }
        return product
    }

    async getByCategory (category) {
        return await this.productRepository.getByCategory(category)
    }
}
