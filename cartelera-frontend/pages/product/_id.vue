<template>
  <div class="page-wrapper">
    <div class="product-detail-page">
      <AppHeader />

      <div class="breadcrumb">
        <NuxtLink to="/Home">
          Home
        </NuxtLink>
        <span> > </span>
        <NuxtLink to="/shop">
          Shop
        </NuxtLink>
        <span> > </span>
        <span class="current">{{ product?.name || 'Product' }}</span>
      </div>

      <div v-if="product" class="product-container">
        <div class="image-column">
          <div class="thumbnail-list">
            <div v-for="i in 4" :key="i" class="thumbnail-wrapper">
              <div class="thumbnail-background">
                <img :src="product.image" class="thumbnail">
              </div>
            </div>
          </div>
        </div>
        <div class="image-display">
          <img :src="product.image" class="main-image">
        </div>
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="price">
            $ {{ Number(product.price).toFixed(2) }}
          </p>

          <div class="star-reviews">
            <v-icon small color="#FFD700">
              mdi-star
            </v-icon>
            <v-icon small color="#FFD700">
              mdi-star
            </v-icon>
            <v-icon small color="#FFD700">
              mdi-star
            </v-icon>
            <v-icon small color="#FFD700">
              mdi-star
            </v-icon>
            <v-icon small color="#FFD700">
              mdi-star-half-full
            </v-icon>
            <span class="review-count">2 Customer Reviews</span>
          </div>

          <p class="description">
            {{ product.description }}
          </p>

          <div class="option-group">
            <label>Size</label>
            <div class="size-options">
              <v-btn
                v-for="size in ['XS', 'L', 'XL']"
                :key="size"
                x-small
                class="option"
                :color="selectedSize === size ? 'primary' : ''"
                @click="selectedSize = size"
              >
                {{ size }}
              </v-btn>
            </div>
          </div>

          <div class="option-group">
            <label>Color</label>
            <div class="color-options">
              <div
                v-for="color in colors"
                :key="color"
                class="color-circle"
                :style="{ backgroundColor: color }"
                :class="{ selected: selectedColor === color }"
                @click="selectedColor = color"
              />
            </div>
          </div>

          <div class="quantity-group">
            <v-btn icon @click="decreaseQty">
              -
            </v-btn>
            <span class="quantity">{{ quantity }}</span>
            <v-btn icon @click="increaseQty">
              +
            </v-btn>
            <v-btn class="add-btn" color="black" dark @click="addToCart">
              Add to cart
            </v-btn>
          </div>

          <div class="meta-info">
            <p><strong>SKU</strong>: {{ product.sku }}</p>
            <p><strong>Category</strong>: {{ product.category || 'N/A' }}</p>
            <p>
              <strong>Tags</strong>:
              {{
                Array.isArray(product.tags)
                  ? product.tags.join(', ')
                  : generateTags(product.description || '').join(', ')
              }}
            </p>
            <div class="share-icons">
              <v-icon small>
                mdi-facebook
              </v-icon>
              <v-icon small>
                mdi-linkedin
              </v-icon>
              <v-icon small>
                mdi-twitter
              </v-icon>
              <v-icon small>
                mdi-heart-outline
              </v-icon>
            </div>
          </div>

          <div class="buttons">
            <template v-if="isAdmin">
              <v-btn color="#9bdff3" @click="openAddModal">
                Add Product
              </v-btn>
              <v-btn color="#f3f19a" @click="openEditModal">
                Edit
              </v-btn>
              <v-btn color="#ea8080" @click="showDeleteConfirm = true">
                Delete
              </v-btn>
            </template>
          </div>
        </div>
      </div>
      <hr class="section-divider">

      <div class="tab-section">
        <div class="tabs">
          <button
            class="tab"
            :class="{ active: activeTab === 'description' }"
            @click="activeTab = 'description'"
          >
            Description
          </button>
          <button
            class="tab"
            :class="{ active: activeTab === 'info' }"
            @click="activeTab = 'info'"
          >
            Additional Information
          </button>
          <button
            class="tab"
            :class="{ active: activeTab === 'reviews' }"
            @click="activeTab = 'reviews'"
          >
            Reviews [2]
          </button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'description'">
            <p>
              This piece of furniture is designed to seamlessly combine style and functionality, making it an ideal addition to any space in your home or office. Whether you're aiming for a modern, minimalist, rustic, or classic look, its clean lines and versatile design ensure it complements a wide range of interiors.
            </p>
            <p>
              Constructed from durable, high-quality materials, this product offers long-lasting performance and everyday comfort. Its structure is engineered to support daily use while also elevating the aesthetics of the room it occupies. Use it to organize, decorate, or simply enhance the visual harmony of your environment.
            </p>
            <p>
              Suitable for living rooms, bedrooms, hallways, or workspaces, this furniture item balances practicality and visual appeal, providing you with both functionality and elegance in a single piece.
            </p>
            <div v-if="product" class="description-image-container">
              <img :src="product.image" alt="Imagen del producto" class="description-image">
            </div>
          </div>
          <div v-else-if="activeTab === 'info' && product">
            <p><strong>Dimensions:</strong> {{ product.dimensions || 'N/A' }}</p>
            <p><strong>Weight:</strong> {{ product.weight || 'N/A' }}</p>
            <p><strong>Material:</strong> {{ product.material || 'N/A' }}</p>
          </div>
          <div v-else-if="activeTab === 'reviews'">
            <p><strong>⭐️⭐️⭐️⭐️☆</strong> Great quality and very elegant – Emily </p>
            <p><strong>⭐️⭐️⭐️⭐️⭐️</strong> Just what I needed for my space – Noah </p>
          </div>
        </div>
      </div>

      <hr class="section-divider">

      <div v-if="relatedProducts.length" class="related-products-section">
        <h3 class="section-title">
          Related Products
        </h3>

        <div class="related-products-grid">
          <div
            v-for="product in relatedProducts"
            :key="product.id"
            class="related-product-card"
            @click="$router.push(`/product/${product.id}`)"
          >
            <img :src="product.image" class="related-img">
            <p class="related-name">
              {{ product.name }}
            </p>
            <p class="related-price">
              {{ Number(product.price).toFixed(2) }}
            </p>
          </div>
        </div>

        <div class="view-more">
          <NuxtLink to="/shop">
            View More
          </NuxtLink>
        </div>
      </div>

      <v-alert v-if="!product" type="info" class="mt-10 text-center">
        Loading product...
      </v-alert>
    </div>

    <v-dialog v-if="product" v-model="showSuccessModal" width="300" persistent>
      <v-card class="pa-4 text-center">
        <v-icon color="green" size="48">
          mdi-check-circle
        </v-icon>
        <h3 class="mt-3">
          Product Added!
        </h3>
        <p class="text--secondary mt-2">
          {{ product ? product.name : 'Product' }} has been added to the cart.
        </p>
        <v-btn color="black" class="mt-4" dark @click="showSuccessModal = false">
          OK
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showWarningModal" width="300" persistent>
      <v-card class="pa-4 text-center">
        <v-icon color="orange" size="48">
          mdi-alert-circle
        </v-icon>
        <h3 class="mt-3">
          Missing Selection
        </h3>
        <p class="text--secondary mt-2">
          Please select a size and color before adding the product to the cart.
        </p>
        <v-btn color="black" class="mt-4" dark @click="showWarningModal = false">
          Got it
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showProductModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h6">
          {{ isEditing ? 'Edit Product' : 'Add Product' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="form.name" label="Product Name" outlined dense />
          <v-textarea v-model="form.description" label="Description" outlined dense />
          <v-text-field v-model="form.price" label="Price" type="number" outlined dense />
          <v-text-field v-model="form.stock" label="Stock" type="number" outlined dense />
          <v-text-field v-model="form.category" label="Category" outlined dense />
          <v-text-field v-model="form.brand" label="Brand" outlined dense />
          <v-text-field v-model="form.weight" label="Weight" outlined dense />
          <v-text-field v-model="form.dimensions" label="Dimensions" outlined dense />
          <v-text-field v-model="form.color" label="Color" outlined dense />
          <v-text-field v-model="form.material" label="Material" outlined dense />
          <v-file-input
            label="Upload Image"
            outlined
            dense
            accept="image/*"
            @change="onImageSelected"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showProductModal = false">
            Cancel
          </v-btn>
          <v-btn color="black" dark @click="submitProduct">
            {{ isEditing ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteConfirm" width="400">
      <v-card class="pa-4 text-center">
        <v-icon color="red" size="48">
          mdi-alert
        </v-icon>
        <h3 class="mt-3">
          Delete Product
        </h3>
        <p class="text--secondary mt-2">
          Are you sure you want to delete this product?
        </p>
        <v-card-actions class="justify-center mt-4">
          <v-btn color="grey" @click="showDeleteConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="error" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <PageFooter />
  </div>
</template>

<script>
import axios from 'axios'
import AppHeader from '~/components/PageHeader.vue'
import PageFooter from '~/components/PageFooter.vue'

export default {
  components: {
    AppHeader,
    PageFooter
  },
  data () {
    return {
      product: null,
      isAdmin: false,
      quantity: 1,
      selectedSize: null,
      selectedColor: null,
      colors: ['#F5F5DC', 'black', '#d5bd63'],
      currentImage: '',
      activeTab: 'description',
      relatedProducts: [],
      showSuccessModal: false,
      showWarningModal: false,
      showProductModal: false,
      showDeleteConfirm: false,
      isEditing: false,
      form: {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
        weight: '',
        dimensions: '',
        color: '',
        material: '',
        image: '',
        imageFile: null
      }
    }
  },
  mounted () {
    this.fetchProduct()
    this.checkAdmin()
    this.fetchRelatedProducts()
  },
  methods: {
    fetchRelatedProducts () {
      axios.get('http://localhost:5020/api/products')
        .then((res) => {
          const all = res.data.filter(p => p.id !== this.product?.id)
          this.relatedProducts = all.sort(() => 0.5 - Math.random()).slice(0, 4)
        })
        .catch((err) => {
          console.error('Error al obtener productos relacionados:', err)
        })
    },
    fetchProduct () {
      const id = this.$route.params.id
      axios.get(`http://localhost:5020/api/products/${id}`)
        .then((res) => {
          this.product = res.data

          if (!this.product.sku) {
            const generated = this.generateSku(this.product.name)
            this.product.sku = generated
          }

          this.currentImage = res.data.image
        })
        .catch((err) => {
          console.error('Error fetching product:', err)
          this.product = null
        })
    },
    increaseQty () {
      this.quantity++
    },
    decreaseQty () {
      if (this.quantity > 1) { this.quantity-- }
    },
    addToCart () {
      if (!this.selectedSize || !this.selectedColor) {
        this.showWarningModal = true
        return
      }

      const carrito = JSON.parse(localStorage.getItem('carrito')) || []

      const existente = carrito.find(p =>
        p.id === this.product.id &&
        p.size === this.selectedSize &&
        p.color === this.selectedColor
      )

      if (existente) {
        existente.quantity += this.quantity
      } else {
        carrito.push({
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          image: this.product.image,
          size: this.selectedSize,
          color: this.selectedColor,
          quantity: this.quantity
        })
      }

      localStorage.setItem('carrito', JSON.stringify(carrito))
      window.dispatchEvent(new Event('carrito-actualizado'))
      this.showSuccessModal = true
    },
    deleteProduct () {
      if (confirm('Are you sure you want to delete this product?')) {
        axios.delete(`http://localhost:5020/api/products/delete/${this.product.id}`)
          .then(() => {
            alert('Product deleted successfully.')
            this.$router.push('/shop')
          })
          .catch((err) => {
            console.error('Error deleting product: ', err)
          })
      }
    },
    checkAdmin () {
      const userStr = localStorage.getItem('user')

      try {
        const user = JSON.parse(userStr)
        this.isAdmin = user?.rol === 'admin'
      } catch (err) {
        console.warn('❗ Invalid user JSON:', userStr)
        this.isAdmin = false
      }
    },
    generateSku (name) {
      if (!name) { return 'SKU-00000' }
      const base = name.replace(/\s+/g, '').substring(0, 3).toUpperCase()
      const random = Math.floor(1000 + Math.random() * 9000)
      return `SKU-${base}${random}`
    },
    generateTags (desc) {
      if (!desc || typeof desc !== 'string') { return ['general'] }
      const words = desc.split(/\W+/).filter(w => w.length > 4)
      return [...new Set(words.slice(0, 3).map(w => w.toLowerCase()))]
    },
    openEditModal () {
      this.isEditing = true
      this.form = {
        name: this.product.name || '',
        description: this.product.description || '',
        price: this.product.price || '',
        stock: this.product.stock || '',
        category: this.product.category || '',
        brand: this.product.brand || '',
        weight: this.product.weight || '',
        dimensions: this.product.dimensions || '',
        color: this.product.color || '',
        material: this.product.material || '',
        image: this.product.image || ''
      }
      this.showProductModal = true
    },
    openAddModal () {
      this.isEditing = false
      this.form = {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
        weight: '',
        dimensions: '',
        color: '',
        material: '',
        image: ''
      }
      this.showProductModal = true
    },
    submitProduct () {
      const formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('description', this.form.description)
      formData.append('price', this.form.price)
      formData.append('stock', this.form.stock)
      formData.append('category', this.form.category)
      formData.append('brand', this.form.brand)
      formData.append('weight', this.form.weight)
      formData.append('dimensions', this.form.dimensions)
      formData.append('color', this.form.color)
      formData.append('material', this.form.material)

      if (this.form.imageFile) {
        formData.append('image', this.form.imageFile)
      } else if (this.form.image) {
        formData.append('imageUrl', this.form.image)
      }

      const url = this.isEditing
        ? `http://localhost:5020/api/products/update/${this.product.id}`
        : 'http://localhost:5020/api/products/create'

      const method = this.isEditing ? 'put' : 'post'

      axios({
        method,
        url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(() => {
          this.showProductModal = false
          alert(this.isEditing ? 'Product updated!' : 'Product added!')
          this.fetchProduct()
        })
        .catch((err) => {
          console.error('❌ Error submitting product:', err)
          alert('Something went wrong.')
        })
    },
    onImageSelected (file) {
      this.form.imageFile = file
    },
    confirmDelete () {
      this.deleteProduct()
      this.showDeleteConfirm = false
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  max-width: 100%;
  overflow-x: hidden;
  width: 100vw;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1;
}

.product-detail-page {
  padding: 40px 5vw;
  background-color: #fff;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
}

.breadcrumb {
  margin: 20px 0 20px 60px;
  font-size: 0.9rem;
  color: #000;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 6px;
}

.breadcrumb a {
  color: #000 !important;
  text-decoration: none;
  font-size: 0.9rem;
}

.breadcrumb span {
  font-size: 1.4rem;
  color: #000;
  margin: 0 2px;
}

.breadcrumb .current {
  color: #000;
  font-weight: 500;
  font-size: 0.9rem;
}

.product-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  max-width: 1200px;
  margin: auto;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
}

.image-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.thumbnail-wrapper {
  border-radius: 10px;
  padding: 8px;
  background-color: transparent;
}

.thumbnail-background {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 12px;
  background-color: #fbebb5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
}

.image-display {
  background-color: #fbebb5;
  border-radius: 10px;
  padding: 20px;
}

.main-image {
  width: 420px;
  height: auto;
  object-fit: contain;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.price {
  font-size: 1.8rem;
  color: #b08500;
  font-weight: bold;
}

.star-reviews {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: -10px;
}

.review-count {
  margin-left: 10px;
  font-size: 0.9rem;
  color: #555;
}

.description {
  color: #444;
  font-size: 1rem;
  line-height: 1.6;
}

.meta-info {
  margin-top: 10px;
  font-size: 0.95rem;
  color: #333;
}

.share-icons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.product-options {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.option-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.size-options .option {
  margin-right: 5px;
  border-radius: 15px;
  font-size: 0.75rem;
  text-transform: none;
  min-width: 30px;
}

.color-options {
  display: flex;
  gap: 10px;
}

.color-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.quantity-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.quantity {
  min-width: 20px;
  text-align: center;
}

.add-btn {
  border-radius: 25px;
  padding: 6px 20px;
  font-weight: bold;
  text-transform: none;
}

.color-circle.selected {
  outline: 2px solid black;
  box-shadow: 0 0 4px black;
}

.section-divider {
  margin: 40px auto;
  border: none;
  border-top: 1px solid #eee;
  width: 90%;
}

.tab-section {
  text-align: center;
  padding: 20px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
}

.tab {
  background: none;
  border: none;
  font-size: 1.3rem;
  padding: 12px;
  cursor: pointer;
  color: #666;
  font-weight: 600;
  position: relative;
}

.tab.active {
  color: #000;
  font-weight: bold;
}

.tab.active::after {
  display: none;
}

.tab-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
  color: #333;
  font-size: 1.05rem;
  line-height: 1.9;
  text-align: justify;
}

.description-image-container {
  background-color: #fff6df;
  padding: 30px;
  border-radius: 16px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.description-image {
  max-width: 100%;
  width: 500px;
  height: auto;
  object-fit: contain;
}

.related-products-section {
  text-align: center;
  padding: 40px 20px;
}

.section-title {
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 30px;
}

.related-products-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 60px;
}

.related-product-card {
  width: 260px;
  cursor: pointer;
  transition: transform 0.2s;
  text-align: center;
}

.related-img {
  width: 100%;
  max-height: 260px;
  object-fit: contain;
  margin-bottom: 12px;
}

.related-name {
  font-size: 1.4rem;
  color: #333;
  margin: 0;
  font-weight: 500;
}

.related-price {
  font-size: 1.4rem;
  margin-top: 6px;
  color: #000;
}

.view-more {
  margin-top: 30px;
}

.view-more a {
  text-decoration: none;
  font-weight: 500;
  border-bottom: 2px solid #000;
  padding-bottom: 2px;
  color: #000;
  font-size: 1.1rem;
}

.related-products-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
}

.related-product-card {
  width: 300px;
  cursor: pointer;
  transition: transform 0.2s;
  text-align: center;
}

.related-product-card:hover {
  transform: scale(1.03);
}

.related-img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 10px;
}

.related-name {
  font-size: 1.4rem;
  color: #333;
  margin: 0;
}

.related-price {
  font-weight: bold;
  margin-top: 4px;
  color: #222;
}

.view-more {
  margin-top: 30px;
}

.view-more a {
  text-decoration: none;
  font-weight: 500;
  border-bottom: 2px solid #000;
  padding-bottom: 2px;
  color: #000;
}

/* Eliminar estilos para el footer*/
footer,
.main-footer {
  width: 100%;
  max-width: 100vw;
  margin: 0;
  padding: 40px 20px;
  background-color: #f2f2f2;
  overflow-x: hidden;
  box-sizing: border-box;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-box {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 15px;
  text-align: center;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-box-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1rem;
}

.modal-box button {
  flex: 1 1 120px;
  padding: 10px 15px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
    align-items: center;
  }

  .image-column {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .thumbnail {
    width: 50px;
    height: 50px;
  }

  .image-display {
    width: 100%;
    text-align: center;
  }

  .main-image {
    width: 90%;
    max-width: 320px;
    object-fit: contain;
  }

  .product-info {
    width: 100%;
    padding: 20px 10px;
  }

  .tabs {
    flex-direction: column;
    gap: 10px;
  }

  .tab-content {
    padding: 20px 10px;
  }

  .description-image-container {
    padding: 20px;
  }

  .related-products-grid {
    flex-direction: column;
    align-items: center;
  }

  .related-product-card {
    width: 90%;
  }
}

@media (max-width: 480px) {
  .modal-box {
    padding: 1rem 1.2rem;
  }

  .modal-box p {
    font-size: 0.95rem;
  }
}

html, body {
  overflow-x: hidden;
}

.product-detail-page,
.page-wrapper {
  overflow-x: hidden;
  max-width: 100vw;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

html, body, #__nuxt, #__layout, .v-application, .v-main {
  margin: 0;
  padding: 0;
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
}

::v-deep(.container) {
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
  max-width: 100vw !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
}
</style>
