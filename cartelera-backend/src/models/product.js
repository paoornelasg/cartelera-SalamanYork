export default class Product {
  constructor ({
      id,
      name,
      description,
      price,
      stock,
      category,
      brand = '',
      weight = '',
      dimensions = '',
      color = '',
      material = '',
      image = ''
    }) {
      this.id = id
      this.name = name
      this.description = description
      this.price = price
      this.stock = stock
      this.category = category
      this.brand = brand
      this.weight = weight
      this.dimensions = dimensions
      this.color = color
      this.material = material
      this.image = image
    }
}
