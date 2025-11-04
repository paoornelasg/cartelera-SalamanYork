<template>
  <div class="store-container">
    <!-- Cuadros de resumen de inventario -->
    <div class="inventory-summary">
      <h1 class="mb-4">
        Overall Inventory
      </h1>

      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card">
            <v-card-text class="text-center">
              <div class="text-h5 mb-2">
                Categories
              </div>
              <div class="text-h4 success--text font-weight-bold">
                {{ totalCategories }}
              </div>
              <div class="text-caption">
                Last 7 days: {{ getNewCategoriesLast7Days() }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card">
            <v-card-text class="text-center">
              <div class="text-h5 mb-2">
                Total Products
              </div>
              <div class="text-h4 info--text font-weight-bold">
                {{ totalProducts}}
              </div>
              <div class="text-caption">
                Last 7 days: {{ getNewProductsLast7Days() }}
              </div>
              <div class="text-caption">
                Total Revenue: {{ formatCurrency(calculateTotalRevenue()) }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card">
            <v-card-text class="text-center">
              <div class="text-h5 mb-2">
                Top Selling
              </div>
              <div class="text-h4 primary--text font-weight-bold">
                {{ getTopSellingProducts().length }}
              </div>
              <div class="text-caption">
                Last 7 days: {{ getTopSellingProductsLast7Days().length }}
              </div>
              <div class="text-caption">
                Cost: {{ formatCurrency(calculateTopSellingCost()) }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="summary-card">
            <v-card-text class="text-center">
              <div class="text-h5 mb-2">
                Low Stock
              </div>
              <div class="text-h4 error--text font-weight-bold">
                {{ getLowStockCount() }}
              </div>
              <div class="text-caption">
                Ordered: {{ getOrderedLowStockCount() }}
              </div>
              <div class="text-caption">
                Not in Stock: {{ getNotInStockCount() }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Barra de acciones -->
    <div class="action-bar my-4">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between flex-wrap">
            <div class="d-flex align-center">
              <v-btn color="primary" class="mr-2" @click="openAddProductModal">
                <v-icon left>
                  mdi-plus
                </v-icon>
                Add Product
              </v-btn>
              <v-menu offset-y :close-on-content-click="false">
                <template #activator="{ on, attrs }">
                  <v-btn
                    color="secondary"
                    v-bind="attrs"
                    class="mr-2"
                    v-on="on"
                  >
                    <v-icon left>
                      mdi-filter
                    </v-icon>
                    Filters
                  </v-btn>
                </template>
                <v-card min-width="300">
                  <v-card-title>Filtros</v-card-title>
                  <v-card-text>
                    <v-select
                      v-model="categoryFilter"
                      :items="categories"
                      label="Categoría"
                      clearable
                      outlined
                      dense
                      class="mb-2"
                    />
                    <v-select
                      v-model="stockFilter"
                      :items="stockStatuses"
                      label="Estado"
                      clearable
                      outlined
                      dense
                      class="mb-2"
                    />
                    <v-text-field
                      v-model="minPriceFilter"
                      label="Precio mínimo"
                      type="number"
                      clearable
                      outlined
                      dense
                      class="mb-2"
                    />
                    <v-text-field
                      v-model="maxPriceFilter"
                      label="Precio máximo"
                      type="number"
                      clearable
                      outlined
                      dense
                      class="mb-2"
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn text color="grey" @click="resetFilters">
                      Limpiar
                    </v-btn>
                    <v-btn color="primary" @click="applyFilters">
                      Aplicar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>

              <v-btn color="success" class="mr-2" @click="downloadInventory">
                <v-icon left>
                  mdi-download
                </v-icon>
                Download All
              </v-btn>
            </div>

            <div class="search">
              <v-text-field
                v-model="searchTerm"
                label="Buscar producto..."
                prepend-icon="mdi-magnify"
                outlined
                dense
                hide-details
                @input="searchProducts"
              />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

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
        <!-- Columna de Productos (nombre del producto) -->
        <template #[`item.name`]="{ item }">
          {{ item.name }}
        </template>

        <!-- Columna de Buying Price -->
        <template #[`item.buyingPrice`]="{ item }">
          {{ formatCurrency(item.buyingPrice) }}
        </template>

        <!-- Columna de Quantity (stock) -->
        <template #[`item.stock`]="{ item }">
          {{ item.stock }}
        </template>

        <!-- Columna de Threshold Value -->
        <template #[`item.thresholdValue`]="{ item }">
          {{ item.thresholdValue }}
        </template>

        <!-- Columna de Expiry Date -->
        <template #[`item.expiryDate`]="{ item }">
          {{ formatDate(item.expiryDate) }}
        </template>

        <!-- Columna de Availability (estado del stock) -->
        <template #[`item.stockStatus`]="{ item }">
          <v-chip
            :color="getStockStatusColor(item.stockStatus)"
            text-color="white"
            small
          >
            {{ item.stockStatus }}
          </v-chip>
        </template>

        <!-- Columna de acciones -->
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

    <!-- Modal for adding/editing product -->
    <v-dialog v-model="showModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">New Product</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addProduct()">
            <v-container>
              <v-row class="mb-4">
                <v-col cols="12" class="text-center">
                  <v-sheet
                    class="mx-auto position-relative"
                    height="200"
                    width="200"
                    color="grey lighten-3"
                    outlined
                  >
                    <div
                      class="d-flex flex-column align-center justify-center fill-height"
                      style="border: 2px dashed #BDBDBD; border-radius: 4px; height: 100%;"
                      @click="$refs.imageUpload.click()"
                      @dragover.prevent
                      @drop.prevent="handleDrop"
                    >
                      <v-icon size="48" color="grey">
                        mdi-image-plus
                      </v-icon>
                      <span class="mt-2 text-center blue--text">Drag Image or<br>Browse Image</span>
                    </div>
                    <input
                      ref="imageUpload"
                      type="file"
                      accept="image/*"
                      style="display: none"
                      @change="handleFileUpload"
                    >
                  </v-sheet>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="d-flex align-center">
                  <span class="subtitle-1">Product Name</span>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="productForm.name"
                    placeholder="Enter"
                    required
                    dense
                    outlined
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="d-flex align-center">
                  <span class="subtitle-1">Product ID</span>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="productForm.sku"
                    placeholder="Enter"
                    dense
                    outlined
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="d-flex align-center">
                  <span class="subtitle-1">Category</span>
                </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="productForm.category"
                    :items="categories"
                    placeholder="Select"
                    required
                    dense
                    outlined
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="d-flex align-center">
                  <span class="subtitle-1">Buying Price</span>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="productForm.buyingPrice"
                    placeholder="Enter"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    dense
                    outlined
                    prefix="$"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="d-flex align-center">
                  <span class="subtitle-1">Quantity</span>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="productForm.stock"
                    placeholder="Enter"
                    type="number"
                    min="0"
                    required
                    dense
                    outlined
                    hide-details="auto"
                    @input="updateStockStatus"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="d-flex align-center">
                  <span class="subtitle-1">Unity</span>
                </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="productForm.unity"
                    :items="['Unit', 'Kg', 'Liter', 'Box', 'Package', 'Other']"
                    placeholder="Select"
                    dense
                    outlined
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="d-flex align-center">
                  <span class="subtitle-1">Expiry Date</span>
                </v-col>
                <v-col cols="8">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="productForm.expiryDate"
                        placeholder="Select date"
                        readonly
                        dense
                        outlined
                        v-bind="attrs"
                        hide-details="auto"
                        append-icon="mdi-calendar"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="productForm.expiryDate"
                      @input="dateMenu = false"
                    />
                  </v-menu>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="d-flex align-center">
                  <span class="subtitle-1">Threshold Value</span>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="productForm.thresholdValue"
                    placeholder="Enter"
                    type="number"
                    min="0"
                    required
                    dense
                    outlined
                    hide-details="auto"
                    @input="updateStockStatus"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="d-flex align-center">
                  <span class="subtitle-1">Supplier Name</span>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="productForm.supplier"
                    placeholder="Enter"
                    required
                    dense
                    outlined
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="d-flex align-center">
                  <span class="subtitle-1">Supplier Contact</span>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="productForm.supplierContact"
                    placeholder="Enter"
                    required
                    dense
                    outlined
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" text @click="closeModals">
            Discard
          </v-btn>
          <v-btn color="success" text @click="showEditModal ? updateProduct() : addProduct()">
            {{ showEditModal ? 'Update Product' : 'Add Product' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de detalles del producto -->
    <v-dialog v-model="showDetailsModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Detalles del Producto</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row class="mb-4">
              <v-col cols="12" class="text-center">
                <v-sheet
                  class="mx-auto position-relative"
                  height="200"
                  width="200"
                  color="grey lighten-3"
                  outlined
                >
                  <!-- Muestra imagen del producto, si no hay muestra el placeholder -->
                  <v-img
                    v-if="selectedProduct.image"
                    :src="selectedProduct.image"
                    height="100%"
                    width="100%"
                    contain
                  />
                  <div
                    v-else
                    class="d-flex flex-column align-center justify-center fill-height"
                    style="border: 2px dashed #BDBDBD; border-radius: 4px; height: 100%;"
                  >
                    <v-icon size="48" color="grey">
                      mdi-image
                    </v-icon>
                    <span class="mt-2 text-center grey--text">Imagen no Disponible</span>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Nombre del Producto</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="selectedProduct.name"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">ID del Producto</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="selectedProduct.sku"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Categoría</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="selectedProduct.category"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Precio de Compra</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  :value="formatCurrency(selectedProduct.buyingPrice)"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                  prefix="$"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Precio de Venta</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  :value="formatCurrency(selectedProduct.price)"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                  prefix="$"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Cantidad</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="selectedProduct.stock"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Unidad</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="selectedProduct.unity"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Fecha de Caducidad</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  :value="formatDate(selectedProduct.expiryDate)"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Valor Umbral</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="selectedProduct.thresholdValue"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Estado de Inventario</span>
              </v-col>
              <v-col cols="8">
                <v-chip
                  :color="getStockStatusColor(selectedProduct.stockStatus)"
                  text-color="white"
                  small
                >
                  {{ selectedProduct.stockStatus }}
                </v-chip>
              </v-col>
            </v-row>

            <v-row v-if="selectedProduct.supplier">
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Proveedor</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="selectedProduct.supplier"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <v-row v-if="selectedProduct.supplierContact">
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Contacto del Proveedor</span>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="selectedProduct.supplierContact"
                  dense
                  outlined
                  readonly
                />
              </v-col>
            </v-row>

            <v-row v-if="selectedProduct.description">
              <v-col cols="4" class="d-flex align-center">
                <span class="subtitle-1">Descripción</span>
              </v-col>
              <v-col cols="8">
                <v-textarea
                  v-model="selectedProduct.description"
                  dense
                  outlined
                  readonly
                  hide-details="auto"
                  rows="3"
                  auto-grow
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" text @click="showDetailsModal = false">
            Cerrar
          </v-btn>
          <v-btn color="primary" text @click="editFromDetails()">
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
      salesData: {
        last7DaysProducts: 8,
        last7DaysCategories: 2,
        last7DaysTopSelling: 3,
        orderedLowStock: 4,
        notInStock: 2
      },
      totalProducts: 0,
      totalCategories: 0,
      searchTerm: '',
      categoryFilter: '',
      stockFilter: '',
      minPriceFilter: '',
      maxPriceFilter: '',
      sortKey: 'name',
      sortDir: 'asc',
      currentPage: 1,
      pageCount: 0,
      itemsPerPage: 10,
      showAddModal: false,
      showEditModal: false,
      showDetailsModal: false,
      showDeleteModal: false,
      dateMenu: false,
      productForm: {
        id: null,
        name: '',
        category: 'Electrónica',
        price: 0,
        buyingPrice: 0,
        stock: 0,
        thresholdValue: 10,
        expiryDate: null,
        stockStatus: 'In Stock',
        description: '',
        sku: '',
        supplier: '',
        supplierContact: '',
        image: '',
        topSelling: 0,
      },
      selectedProduct: {},
      productToDelete: null,
      headers: [
        { text: 'Product', value: 'name', sortable: true },
        { text: 'Buying Price', value: 'buyingPrice', sortable: true },
        { text: 'Quantity', value: 'stock', sortable: true },
        { text: 'Threshold Value', value: 'thresholdValue', sortable: true },
        { text: 'Expiry Date', value: 'expiryDate', sortable: true },
        { text: 'Availability', value: 'stockStatus', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      categories: ['', 'Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Alimentos', 'Medicamentos', 'Otros'],
      stockStatuses: ['', 'In Stock', 'Low Stock', 'Out of Stock']
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
    this.fetchProducts().then(() => this.applyFilters())
    this.fetchTotalProducts()
    this.fetchTotalCategories()
  },
  methods: {
    async fetchProducts () {
      try {
        const response = await this.$axios.get('/products')
        this.products = response.data.map(p => ({
          id: p.id,
          name: p.nombreProducto,
          buyingPrice: p.precioCompra,
          price: p.precio,
          category: p.categoria,
          stock: p.Cantidad,
          thresholdValue: p.valorUmbral,
          expiryDate: p.fechaExpiracion,
          stockStatus: this.getStockStatus(p.Cantidad, p.valorUmbral),
          description: '',
          sku: p.id,
          supplier: p.nombreProveedor,
          supplierContact: p.numeroProveedor,
          unity: p.unidad,
          image: p.imagen,
          topSelling: p.isTopSelling ?? Math.floor(Math.random() * 10) + 1
      }))
        this.applyFilters()
      } catch (error) {
        this.$store.dispatch('alert/triggerAlert', {
          message: error.message,
          type: 'error'
        })
      }
    },
    async fetchTotalProducts () {
      try {
        const response = await this.$axios.get('/products/total-products')
        this.totalProducts = response.data
      } catch (error) {
        this.$store.dispatch('alert/triggerAlert', {
          message: 'No se pudo obtener el total de productos',
          type: 'error'
        })
      }
    },
    async fetchTotalCategories () {
      try {
        const response = await this.$axios.get('/products/total-categories')
        this.totalCategories = response.data
      } catch (error) {
        this.$store.dispatch('alert/triggerAlert', {
          message: 'No se pudo obtener el total de categorías',
          type: 'error'
        })
      }
    },
    // Resto de métodos
    getNewProductsLast7Days () {
      return this.salesData.last7DaysProducts
    },
    getNewCategoriesLast7Days () {
      return this.salesData.last7DaysCategories
    },
    getTopSellingProducts () {
      return [...this.products]
        .sort((a, b) => b.topSelling - a.topSelling)
        .slice(0, 3)
    },
    getTopSellingProductsLast7Days () {
      return this.products.filter(p => p.isTopSelling).slice(0, this.salesData.last7DaysTopSelling)
    },
    calculateTopSellingCost () {
      return this.getTopSellingProducts().reduce((total, product) => total + product.buyingPrice, 0)
    },
    calculateTotalRevenue () {
      return this.products.reduce((total, product) => total + (product.price * (product.sales || 0)), 0)
    },
    getOrderedLowStockCount () {
      return this.salesData.orderedLowStock
    },
    getNotInStockCount () {
      return this.products.filter(p => p.stockStatus === 'Out of Stock').length
    },
    applyFilters () {
      let filtered = [...this.products]
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(term) ||
          product.id.toString().includes(term) ||
          product.sku.toLowerCase().includes(term)
        )
      }
      if (this.categoryFilter) {
        filtered = filtered.filter(product => product.category === this.categoryFilter)
      }
      if (this.stockFilter) {
        filtered = filtered.filter(product => product.stockStatus === this.stockFilter)
      }
      if (this.minPriceFilter) {
        filtered = filtered.filter(product => product.price >= parseFloat(this.minPriceFilter))
      }
      if (this.maxPriceFilter) {
        filtered = filtered.filter(product => product.price <= parseFloat(this.maxPriceFilter))
      }
      this.filteredProducts = filtered
      this.currentPage = 1
    },
    resetFilters () {
      this.categoryFilter = ''
      this.stockFilter = ''
      this.minPriceFilter = ''
      this.maxPriceFilter = ''
      this.searchTerm = ''
      this.applyFilters()
    },
    formatCurrency (value) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(value)
    },
    getStockStatus (stock, threshold) {
      if (stock <= 0) return 'Out of Stock'
      if (stock <= threshold) return 'Low Stock'
      return 'In Stock'
    },
    updateStockStatus () {
      const stock = parseInt(this.productForm.stock)
      const threshold = parseInt(this.productForm.thresholdValue)
      if (stock <= 0) {
        this.productForm.stockStatus = 'Out of Stock'
      } else if (stock <= threshold) {
        this.productForm.stockStatus = 'Low Stock'
      } else {
        this.productForm.stockStatus = 'In Stock'
      }
    },
    viewProductDetails(product) {
      this.selectedProduct = {
        ...product,
        supplierContact: product.supplierContact || product.numeroProveedor || 'N/A'
      }
      this.showDetailsModal = true
    },
    editProduct(product) {
      this.productForm = {
        ...product,
        id: product.id || product.sku || '',
        supplierContact: product.supplierContact || product.numeroProveedor || ''
      }
      this.showEditModal = true
    },
    editFromDetails () {
      this.productForm = JSON.parse(JSON.stringify(this.selectedProduct))
      this.showDetailsModal = false
      this.showEditModal = true
    },
    confirmDelete(product) {
      this.productToDelete = product 
      console.log('🗑 Eliminando producto con ID:', this.productToDelete.id) 
      this.showDeleteModal = true
    },
    async addProduct () {
      try {
        const payload = {
          imagen: this.productForm.image || '',
          nombreProducto: this.productForm.name || '',
          id: this.productForm.sku || '',
          categoria: this.productForm.category || '',
          precioCompra: parseFloat(this.productForm.buyingPrice?.toString().replace('$', '').trim()) || 0,
          precio: parseFloat(this.productForm.price) || 0,
          Cantidad: parseInt(this.productForm.stock) || 0,
          unidad: this.productForm.unity || '',
          fechaExpiracion: this.productForm.expiryDate || 'N/A',
          valorUmbral: parseInt(this.productForm.thresholdValue) || 0,
          nombreProveedor: this.productForm.supplier || 'Proveedor Desconocido',
          numeroProveedor: this.productForm.supplierContact || 'N/A'
        }
        console.log('🧪 Payload que se manda al backend:', payload)
        const response = await this.$axios.post('/products/create', payload)
        const newProduct = {
          id: response.data.id,
          ...this.productForm
        }
        this.products.unshift(newProduct)
        this.applyFilters()
        this.resetForm()
        this.closeModals()
        this.$store.dispatch('alert/triggerAlert', {
          message: 'Producto creado satisfactoriamente',
          type: 'success'
        })
      } catch (error) {
        this.$store.dispatch('alert/triggerAlert', {
          message: error.message,
          type: 'error'
        })
      }
    },
    async updateProduct () {
      try {
        if (!this.productForm || !this.productForm.sku) {
          throw new Error('No se puede editar: el producto no tiene un SKU válido')
        }

        const id = this.productForm.sku
        const payload = {
          imagen: this.productForm.image || '',
          nombreProducto: this.productForm.name || '',
          id,
          categoria: this.productForm.category || '',
          precioCompra: parseFloat(this.productForm.buyingPrice?.toString().replace('$', '').trim()) || 0,
          precio: parseFloat(this.productForm.price) || 0,
          Cantidad: parseInt(this.productForm.stock) || 0,
          unidad: this.productForm.unity || '',
          fechaExpiracion: this.productForm.expiryDate || 'N/A',
          valorUmbral: parseInt(this.productForm.thresholdValue) || 0,
          nombreProveedor: this.productForm.supplier || 'Proveedor Desconocido',
          numeroProveedor: this.productForm.supplierContact || 'N/A'
        }

        console.log('✏️ Editando producto con ID:', id)
        await this.$axios.put(`/products/update/${this.productForm.id}`, payload)

        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = { ...this.productForm }
          this.applyFilters()
        }

        this.closeModals()
        this.$store.dispatch('alert/triggerAlert', {
          message: 'Producto actualizado satisfactoriamente',
          type: 'success'
        })
      } catch (error) {
        console.error('❌ Error al editar producto:', error)
        this.$store.dispatch('alert/triggerAlert', {
          message: error.message,
          type: 'error'
        })
      }
    },

    async deleteProduct () {
      if (!this.productToDelete || !this.productToDelete.id) {
        this.$store.dispatch('alert/triggerAlert', {
          message: 'No hay producto seleccionado para eliminar',
          type: 'error'
        })
        return
      }

      try {
        console.log('🗑 Eliminando:', this.productToDelete)
        await this.$axios.delete(`/products/delete/${this.productToDelete.id}`)
        this.products = this.products.filter(p => p.id !== this.productToDelete.id)
        this.applyFilters()
        this.showDeleteModal = false
        this.productToDelete = null
        this.$store.dispatch('alert/triggerAlert', {
          message: 'Producto eliminado',
          type: 'success'
        })
      } catch (error) {
        this.$store.dispatch('alert/triggerAlert', {
          message: error.message,
          type: 'error'
        })
      }
    },
    closeModals () {
      this.showAddModal = false
      this.showEditModal = false
      this.showDetailsModal = false
      this.resetForm()
      this.applyFilters()
    },
    resetForm () {
      this.productForm = {
        id: null,
        name: '',
        category: 'Electrónica',
        price: 0,
        buyingPrice: 0,
        stock: 0,
        thresholdValue: 10,
        expiryDate: null,
        stockStatus: 'In Stock',
        description: '',
        sku: '',
        supplier: '',
        supplierContact: '',
        image: ''
      }
    },
    getLowStockCount () {
      return this.products.filter(p => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock').length
    },
    openAddProductModal () {
      this.resetForm()
      this.showAddModal = true
    },

    searchProducts () {
      this.applyFilters()
    },

    formatDate (dateString) {
      if (!dateString) return 'N/A'
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('es-ES', options)
    },

    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = e => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxWidth = 800
          const scaleSize = maxWidth / img.width
          canvas.width = maxWidth
          canvas.height = img.height * scaleSize

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // reduce la calidad al 70%
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)

          // Asigna la imagen reducida al formulario
          this.productForm.image = compressedBase64
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    },

    downloadInventory () {
      if (this.products.length === 0) return
      const headers = Object.keys(this.products[0])
        .filter(key => !['isTopSelling', 'ordered'].includes(key))
        .join(',')

      const rows = this.products.map(product => {
        return Object.entries(product)
          .filter(([key]) => !['isTopSelling', 'ordered'].includes(key))
          .map(([_, value]) => {
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          }).join(',')
      }).join('\n')

      const csvContent = `${headers}\n${rows}`
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `inventario_${new Date().toISOString().slice(0, 10)}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    getStockStatusColor (stockStatus) {
      switch (stockStatus) {
        case 'In Stock':
          return 'green'
        case 'Low Stock':
          return 'orange'
        case 'Out of Stock':
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

.inventory-summary {
  margin-bottom: 30px;
}

.summary-card {
  height: 100%;
  transition: transform 0.3s;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.action-bar {
  margin-bottom: 20px;
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
