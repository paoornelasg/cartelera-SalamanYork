<template>
  <v-app>
    <AppHeader />

    <v-main>
      <ProductImage title="Shop" />
      <div class="hero-section">
        <div class="hero-overlay" />
      </div>

      <v-container class="top-filters-bar" fluid>
        <v-row class="align-center justify-space-between top-filters-bar" style="max-width: 1400px; margin: auto;">
          <v-col cols="12" md="6" class="d-flex align-center gap-4 flex-wrap justify-start justify-md-start">
            <div class="d-flex align-center filters-label" style="cursor: pointer;" @click="drawerFilters = !drawerFilters">
              <v-icon class="mr-1 filters-icon">
                mdi-tune
              </v-icon>
              <span class="filters-text">Filters</span>
            </div>

            <v-icon>mdi-view-grid</v-icon>
            <v-icon>mdi-view-agenda</v-icon>

            <span class="filters-text font-weight-medium hidden-sm-and-down">
              Showing {{ shownCount }}–{{ shownCount + paginatedProducts.length - 1 }} of {{ totalProducts }} results
            </span>
          </v-col>

          <v-col cols="12" md="6" class="d-flex align-center justify-start justify-md-end gap-4 flex-wrap">
            <div class="d-flex align-center gap-2">
              <span class="filters-text font-weight-medium">Showㅤ</span>
              <v-text-field
                v-model="itemsPerPage"
                type="number"
                min="1"
                max="50"
                hide-details
                solo
                class="input-flat"
                style="max-width: 50px; font-size: 14px;"
              />
            </div>

            <div class="d-flex align-center gap-2">
              <span class="filters-text font-weight-medium">Sort byㅤ</span>
              <v-select
                v-model="sortOption"
                :items="['Default', 'Price: Low to High', 'Price: High to Low']"
                solo
                hide-details
                class="input-flat"
                style="max-width: 120px; font-size: 14px;"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="drawerFilters" max-width="400px">
        <v-card>
          <v-card-title class="headline">
            Filters
          </v-card-title>

          <v-card-text>
            <v-select v-model="category" label="Category" :items="categories" />
            <v-select v-model="priceRange" label="Price" :items="priceRanges" />
            <v-select v-model="color" label="Color" :items="colors" />
            <v-text-field v-model="searchQuery" label="Search product" prepend-inner-icon="mdi-magnify" />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text color="black" @click="drawerFilters = false">
              Close
            </v-btn>
            <v-btn color="#d4a02b" dark @click="applyFilters">
              Apply
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-container class="products-container">
        <v-row justify="center" align="stretch" class="product-grid">
          <v-col
            v-for="(product, index) in paginatedProducts"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="product-card elevation-0" @click="goToProduct(product.id)">
              <v-img
                :src="product.image"
                height="250"
                class="product-image"
              />

              <v-card-title class="product-title">
                {{ product.name }}
              </v-card-title>

              <v-card-subtitle class="product-price">
                ${{ product.price.toLocaleString() }}
              </v-card-subtitle>

              <v-card-actions>
                <v-btn class="add-to-cart-btn" text @click.stop="addToCart(product)">
                  <v-icon left color="#d4a02b">
                    mdi-cart-plus
                  </v-icon>
                  <span style="color: #d4a02b;">Add to cart</span>
                </v-btn>

                <v-spacer />

                <v-btn icon @click.stop="toggleFavorite(product)">
                  <v-icon :color="product.favorite ? 'red' : 'grey'">
                    mdi-heart
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <div class="text- mt-8">
          <v-pagination v-model="page" :length="totalPages" square color="#d4a02b" @input="changePage" />
        </div>
      </v-container>
      <RoseSection />
      <PageFooter />
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import PageFooter from '~/components/PageFooter.vue'
import ProductImage from '~/components/ProductImage.vue'
import RoseSection from '~/components/RoseSection.vue'
import AppHeader from '~/components/PageHeader.vue'

export default {
  components: {
    PageFooter,
    ProductImage,
    RoseSection,
    AppHeader
  },
  data () {
    return {
      icons: [
        'mdi-account-alert-outline',
        'mdi-magnify',
        'mdi-heart-outline',
        'mdi-cart-outline'
      ],
      category: 'All',
      categories: ['All', 'Chairs', 'Tables', 'Sofas', 'Beds', 'Stools', 'Dining'],
      priceRange: 'All',
      priceRanges: ['All', 'Under $100', '$100-$300', '$300-$500', 'Over $500'],
      color: 'All',
      colors: ['All', 'White', 'Black', 'Wood', 'Gray'],
      searchQuery: '',
      page: 1,
      itemsPerPage: 8,
      products: [],
      drawerFilters: false,
      sortOption: 'Default',
      sortOptions: ['Default', 'Price: Low to High', 'Price: High to Low']
    }
  },

  computed: {
    filteredProducts () {
      let filtered = this.products

      if (this.category !== 'All') {
        filtered = filtered.filter(p => p.category?.toLowerCase() === this.category.toLowerCase())
      }

      if (this.priceRange !== 'All') {
        const [min, max] = this.parsePriceRange(this.priceRange)
        filtered = filtered.filter((p) => {
          if (min === null) { return p.price <= max }
          if (max === null) { return p.price >= min }
          return p.price >= min && p.price <= max
        })
      }

      if (this.color !== 'All') {
        filtered = filtered.filter(p => p.color?.toLowerCase() === this.color.toLowerCase())
      }

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.trim().toLowerCase()
        filtered = filtered.filter((p) => {
          const name = p.name?.toString().toLowerCase() || ''
          const category = p.category?.toString().toLowerCase() || ''
          return name.includes(query) || category.includes(query)
        })
      }

      if (this.sortOption === 'Price: Low to High') {
        filtered = filtered.sort((a, b) => a.price - b.price)
      }
      if (this.sortOption === 'Price: High to Low') {
        filtered = filtered.sort((a, b) => b.price - a.price)
      }

      return filtered
    },

    paginatedProducts () {
      const start = (this.page - 1) * this.itemsPerPage
      return this.filteredProducts.slice(start, start + this.itemsPerPage)
    },

    shownCount () {
      return this.filteredProducts.length === 0 ? 0 : (this.page - 1) * this.itemsPerPage + 1
    },

    totalProducts () {
      return this.filteredProducts.length
    },

    totalPages () {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    }
  },

  mounted () {
    axios.get('http://localhost:5020/api/products')
      .then((res) => {
        this.products = res.data
        console.log('Productos cargados:', res.data)
      })
      .catch((err) => {
        console.error('Error loading products:', err)
      })
  },

  methods: {
    changPage (page) {
      this.page = page

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    isActive (route) {
      return this.$route.path === route
    },

    parsePriceRange (range) {
      if (range === 'Under $100') { return [0, 100] }
      if (range === '$100-$300') { return [100, 300] }
      if (range === '$300-$500') { return [300, 500] }
      if (range === 'Over $500') { return [500, null] }
      return [null, null]
    },

    goToProduct (id) {
      this.$router.push(`/product/${id}`)
    },

    addToCart (product) {
      const carrito = JSON.parse(localStorage.getItem('carrito')) || []
      const existente = carrito.find(p => p.id === product.id)

      if (existente) {
        existente.quantity += 1
      } else {
        carrito.push({ ...product, quantity: 1 })
      }

      localStorage.setItem('carrito', JSON.stringify(carrito))

      this.showAlert(`${product.name} added to cart`, 'success')
    },

    toggleFavorite (product) {
      product.favorite = !product.favorite
      const action = product.favorite ? 'Added to favorites' : 'Removed from favorites'
      this.showAlert(`${product.name} ${action}`, 'info')
    },

    changePage (page) {
      this.page = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    showAlert (message, type) {
      this.$store.dispatch('alert/triggerAlert', { message, type })
    },

    applyFilters () {
      this.drawerFilters = false
      this.page = 1
    }
  }
}
</script>

<style scoped>
.main-header-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
}

.logo-container {
  width: 25%;
  height: 100%;
}

.header-buttons-container {
  display: flex;
  height: 100%;
  gap: 50px;
  justify-content: center;
  align-items: center;
  width: 50%;
}

.header-icons-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  width: 25%;
}

.header-button {
  color: white;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}

.shop-hero {
  background-color: #fbebb5;
  padding: 100px 0;
  text-align: center;
}

.shop-hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2c3e50;
}

.shop-hero p {
  font-size: 1.2rem;
  color: #666;
}

.products-container {
   padding: 0 10px 50px;
}

.product-grid {
  max-width: 1400px;
  margin: 0 auto;
}

.product-card {
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  max-width: 280px;
  width: 100%;
  height: auto;
  margin: auto;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.product-image {
  object-fit: cover;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50 !important;
  padding-top: 0;
}

.products-summary {
  font-size: 0.9rem;
  color: #555;
  margin: 10px 0 20px;
}

.product-card {
  border-radius: 10px;
  box-shadow: none !important;
  transition: 0.2s ease-in-out;
  border: 1px solid transparent;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: none !important;
}

.top-filters-bar {
  background-color: #fef2f2;
  padding: 0 8px !important;
  margin: 12px auto 20px auto;
  border-radius: 0 0 8px 8px;
}

.input-flat.v-input--solo.v-input {
  max-width: 60px;
  font-size: 14px;
}

.input-flat .v-input__control {
  min-height: 32px !important;
  padding: 0 4px;
}

.input-flat.v-select {
  max-width: 120px;
  font-size: 14px;
}

.gap-4 {
  gap: 1rem;
}

.items-per-page-input input {
  text-align: center;
  font-size: 0.85rem;
  padding: 0 6px;
}

.filters-label {
  font-weight: 500;
  font-size: 16px;
  user-select: none;
  display: flex;
  align-items: center;
}

.filters-label .v-icon {
  font-size: 22px;
}

.filters-text {
  font-size: 16px;
  margin-left: 6px;
}

.input-align {
  margin-top: 2px;
}

.add-to-cart-btn {
  text-transform: uppercase;
  font-weight: 500;
  transition: 0.2s ease;
}
.add-to-cart-btn:hover {
  background-color: rgba(166, 124, 0, 0.05);
}

@media (max-width: 960px) {
  .shop-hero {
    padding: 80px 0;
  }

  .shop-hero h1 {
    font-size: 2.5rem;
  }

  .header-buttons-container {
    gap: 30px;
  }
}

@media (max-width: 600px) {
  .shop-hero h1 {
    font-size: 2rem;
  }

  .header-buttons-container {
    gap: 15px;
  }

  .header-button {
    font-size: 0.9rem;
  }

  .logo-link {
    font-size: 1.2rem;
  }
}
</style>
