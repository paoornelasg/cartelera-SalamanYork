<template>
  <div class="store-container">
    <div class="header">
      <h1>Gestión de Tienda</h1>
      <div class="actions">
        <v-btn color="success" @click="showAddModal = true">
          <v-icon left>
            mdi-plus
          </v-icon>
          Nuevo Producto
        </v-btn>
        <div class="search">
          <v-text-field
            v-model="searchTerm"
            label="Buscar producto..."
            prepend-icon="mdi-magnify"
            outlined
            dense
            @input="searchProducts"
          />
        </div>
      </div>
    </div>

    <!-- Filtros adicionales -->
    <v-card class="mb-4">
      <v-card-text>
        <div class="filters">
          <div class="filter-group">
            <v-select
              v-model="categoryFilter"
              :items="categories"
              label="Categoría"
              outlined
              dense
              @change="applyFilters"
            />
          </div>
          <div class="filter-group">
            <v-select
              v-model="stockFilter"
              :items="stockStatuses"
              label="Estado"
              outlined
              dense
              @change="applyFilters"
            />
          </div>
          <div class="filter-group">
            <v-text-field
              v-model="minPriceFilter"
              label="Precio mínimo"
              type="number"
              outlined
              dense
              @change="applyFilters"
            />
          </div>
          <div class="filter-group">
            <v-text-field
              v-model="maxPriceFilter"
              label="Precio máximo"
              type="number"
              outlined
              dense
              @change="applyFilters"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Tabla de productos -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredProducts"
        :items-per-page="itemsPerPage"
        :page.sync="currentPage"
        :sort-by="sortKey"
        :sort-desc="sortDir === 'desc'"
        class="elevation-1"
        @page-count="pageCount = $event"
      >
        <template #[`item.stockStatus`]="{ item }">
          <v-chip
            :color="getStockStatusColor(item.stockStatus)"
            text-color="white"
            small
          >
            {{ item.stockStatus }}
          </v-chip>
        </template>
        <template #[`item.price`]="{ item }">
          {{ formatCurrency(item.price) }}
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="viewProductDetails(item)">
            mdi-eye
          </v-icon>
          <v-icon small class="mr-2" @click="editProduct(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="confirmDelete(item)">
            mdi-delete
          </v-icon>
        </template>

        <template #no-data>
          <div class="no-data">
            No se encontraron productos
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal para añadir/editar producto -->
    <v-dialog v-model="showModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ showEditModal ? 'Editar Producto' : 'Nuevo Producto' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="showEditModal ? updateProduct() : addProduct()">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="productForm.name"
                    label="Nombre del Producto"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="productForm.category"
                    :items="categories"
                    label="Categoría"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="productForm.price"
                    label="Precio"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="productForm.stock"
                    label="Stock"
                    type="number"
                    min="0"
                    required
                    @input="updateStockStatus"
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="productForm.stockStatus"
                    :items="stockStatuses"
                    label="Estado de Stock"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="productForm.description"
                    label="Descripción"
                    rows="3"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="productForm.sku"
                    label="SKU"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="productForm.supplier"
                    label="Proveedor"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeModals">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="showEditModal ? updateProduct() : addProduct()">
            {{ showEditModal ? 'Actualizar' : 'Crear Producto' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de detalles del producto -->
    <v-dialog v-model="showDetailsModal" max-width="700px">
      <v-card>
        <v-card-title>
          <span class="headline">Detalles del Producto #{{ selectedProduct.id }}</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title class="detail-label">
                Nombre:
              </v-list-item-title>
              <v-list-item-subtitle>{{ selectedProduct.name }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="detail-label">
                Categoría:
              </v-list-item-title>
              <v-list-item-subtitle>{{ selectedProduct.category }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="detail-label">
                Precio:
              </v-list-item-title>
              <v-list-item-subtitle>{{ formatCurrency(selectedProduct.price) }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="detail-label">
                Stock:
              </v-list-item-title>
              <v-list-item-subtitle>{{ selectedProduct.stock }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="detail-label">
                Estado:
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  :color="getStockStatusColor(selectedProduct.stockStatus)"
                  text-color="white"
                  small
                >
                  {{ selectedProduct.stockStatus }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="detail-label">
                SKU:
              </v-list-item-title>
              <v-list-item-subtitle>{{ selectedProduct.sku }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="detail-label">
                Proveedor:
              </v-list-item-title>
              <v-list-item-subtitle>{{ selectedProduct.supplier }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-card v-if="selectedProduct.description" class="mt-4">
            <v-card-title>Descripción</v-card-title>
            <v-card-text>{{ selectedProduct.description }}</v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="showDetailsModal = false">
            Cerrar
          </v-btn>
          <v-btn color="blue darken-1" text @click="editFromDetails()">
            Editar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de confirmación para eliminar -->
    <v-dialog v-model="showDeleteModal" max-width="400px">
      <v-card>
        <v-card-title class="headline">
          Confirmar Eliminación
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el producto #{{ productToDelete?.id }} - {{ productToDelete?.name }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="showDeleteModal = false">
            Cancelar
          </v-btn>
          <v-btn color="red darken-1" text @click="deleteProduct">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  layout: 'principal',
  middleware: 'auth',
  data () {
    return {
      products: [],
      filteredProducts: [],
      searchTerm: '',
      categoryFilter: '',
      stockFilter: '',
      minPriceFilter: '',
      maxPriceFilter: '',
      sortKey: 'id',
      sortDir: 'asc',
      currentPage: 1,
      pageCount: 0,
      itemsPerPage: 10,
      showAddModal: false,
      showEditModal: false,
      showDetailsModal: false,
      showDeleteModal: false,
      productForm: {
        id: null,
        name: '',
        category: 'Electrónica',
        price: 0,
        stock: 0,
        stockStatus: 'En Stock',
        description: '',
        sku: '',
        supplier: ''
      },
      selectedProduct: {},
      productToDelete: null,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Producto', value: 'name', sortable: true },
        { text: 'Categoría', value: 'category', sortable: true },
        { text: 'Precio', value: 'price', sortable: true },
        { text: 'Stock', value: 'stock', sortable: true },
        { text: 'Estado', value: 'stockStatus', sortable: true },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      categories: ['', 'Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Otros'],
      stockStatuses: ['', 'En Stock', 'Bajo Stock', 'Agotado']
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },
    showModal: {
      get () {
        return this.showAddModal || this.showEditModal
      },
      set (value) {
        if (!value) {
          this.showAddModal = false
          this.showEditModal = false
        }
      }
    }
  },
  mounted () {
    this.fetchProducts()
  },
  methods: {
    fetchProducts () {
      // Aquí iría tu llamada a la API para obtener los productos
      // Por ahora usaremos datos de ejemplo
      this.products = [
        {
          id: 1,
          name: 'Smartphone XYZ',
          category: 'Electrónica',
          price: 499.99,
          stock: 25,
          stockStatus: 'En Stock',
          description: 'Smartphone de última generación con cámara de 48MP y 128GB de almacenamiento.',
          sku: 'SMRT-001',
          supplier: 'Tech Importers S.L.'
        },
        {
          id: 2,
          name: 'Camiseta Deportiva',
          category: 'Ropa',
          price: 29.95,
          stock: 50,
          stockStatus: 'En Stock',
          description: 'Camiseta deportiva transpirable, perfecta para running.',
          sku: 'TS-SPORT-M',
          supplier: 'Textiles Avanzados Inc.'
        },
        {
          id: 3,
          name: 'Sartén Antiadherente',
          category: 'Hogar',
          price: 45.50,
          stock: 5,
          stockStatus: 'Bajo Stock',
          description: 'Sartén con recubrimiento antiadherente de alta calidad.',
          sku: 'KW-PAN-28',
          supplier: 'Kitchen Supplies Co.'
        },
        {
          id: 4,
          name: 'Balón de Fútbol',
          category: 'Deportes',
          price: 19.99,
          stock: 0,
          stockStatus: 'Agotado',
          description: 'Balón de fútbol oficial, tamaño 5.',
          sku: 'SP-FTBL-5',
          supplier: 'Sports Equipment Ltd.'
        },
        {
          id: 5,
          name: 'Portátil Ultradelgado',
          category: 'Electrónica',
          price: 899.00,
          stock: 12,
          stockStatus: 'En Stock',
          description: 'Portátil ultradelgado con 16GB RAM y SSD de 512GB.',
          sku: 'LPTOP-U14',
          supplier: 'Tech Importers S.L.'
        }
      ]
      this.filteredProducts = [...this.products]
    },
    searchProducts () {
      this.applyFilters()
    },
    applyFilters () {
      // Filtrar por término de búsqueda
      let filtered = [...this.products]

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter((product) => {
          return product.name.toLowerCase().includes(term) ||
                 product.id.toString().includes(term) ||
                 product.sku.toLowerCase().includes(term)
        })
      }

      // Filtrar por categoría
      if (this.categoryFilter) {
        filtered = filtered.filter(product => product.category === this.categoryFilter)
      }

      // Filtrar por estado de stock
      if (this.stockFilter) {
        filtered = filtered.filter(product => product.stockStatus === this.stockFilter)
      }

      // Filtrar por precio mínimo
      if (this.minPriceFilter) {
        filtered = filtered.filter(product => product.price >= parseFloat(this.minPriceFilter))
      }

      // Filtrar por precio máximo
      if (this.maxPriceFilter) {
        filtered = filtered.filter(product => product.price <= parseFloat(this.maxPriceFilter))
      }

      this.filteredProducts = filtered
      this.currentPage = 1
    },
    formatCurrency (value) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(value)
    },
    viewProductDetails (product) {
      this.selectedProduct = { ...product }
      this.showDetailsModal = true
    },
    editProduct (product) {
      this.productForm = JSON.parse(JSON.stringify(product)) // Deep copy
      this.showEditModal = true
    },
    editFromDetails () {
      this.productForm = JSON.parse(JSON.stringify(this.selectedProduct))
      this.showDetailsModal = false
      this.showEditModal = true
    },
    confirmDelete (product) {
      this.productToDelete = product
      this.showDeleteModal = true
    },
    addProduct () {
      // Aquí iría tu llamada a la API para añadir el producto
      const newProduct = {
        ...this.productForm,
        id: this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1
      }
      this.products.unshift(newProduct) // Añadir al principio
      this.applyFilters()
      this.resetForm()
      this.closeModals()
    },
    updateProduct () {
      // Aquí iría tu llamada a la API para actualizar el producto
      const index = this.products.findIndex(p => p.id === this.productForm.id)
      if (index !== -1) {
        this.products[index] = { ...this.productForm }
        this.applyFilters()
      }
      this.closeModals()
    },
    deleteProduct () {
      // Aquí iría tu llamada a la API para eliminar el producto
      if (this.productToDelete) {
        this.products = this.products.filter(p => p.id !== this.productToDelete.id)
        this.applyFilters()
        this.showDeleteModal = false
        this.productToDelete = null
      }
    },
    updateStockStatus () {
      // Actualizar automáticamente el estado del stock basado en la cantidad
      const stock = parseInt(this.productForm.stock)
      if (stock <= 0) {
        this.productForm.stockStatus = 'Agotado'
      } else if (stock <= 10) {
        this.productForm.stockStatus = 'Bajo Stock'
      } else {
        this.productForm.stockStatus = 'En Stock'
      }
    },
    closeModals () {
      this.showAddModal = false
      this.showEditModal = false
      this.showDetailsModal = false
      this.resetForm()
    },
    resetForm () {
      this.productForm = {
        id: null,
        name: '',
        category: 'Electrónica',
        price: 0,
        stock: 0,
        stockStatus: 'En Stock',
        description: '',
        sku: '',
        supplier: ''
      }
    },
    getStockStatusColor (status) {
      switch (status) {
        case 'En Stock':
          return 'green'
        case 'Bajo Stock':
          return 'orange'
        case 'Agotado':
          return 'red'
        default:
          return 'grey'
      }
    }
  }
}
</script>

<style scoped>
.store-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

.search {
  width: 250px;
}

/* Filtros */
.filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-group {
  min-width: 200px;
  flex: 1;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}

.detail-label {
  font-weight: bold !important;
  color: rgba(0,0,0,0.87) !important;
}
</style>
