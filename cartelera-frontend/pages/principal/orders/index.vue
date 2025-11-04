<template>
  <div class="orders-container">
    <div class="header">
      <h1>Gestión de Pedidos</h1>
      <div class="actions">
        <button class="btn-add" @click="showAddModal = true">
          <i class="fas fa-plus" /> Nuevo Pedido
        </button>
        <div class="search">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar pedido..."
            @input="searchOrders"
          >
        </div>
      </div>
    </div>

    <!-- Filtros adicionales -->
    <div class="filters">
      <div class="filter-group">
        <label>Estado:</label>
        <select v-model="statusFilter" @change="applyFilters">
          <option value="">
            Todos
          </option>
          <option value="Pendiente">
            Pendiente
          </option>
          <option value="En Proceso">
            En Proceso
          </option>
          <option value="Enviado">
            Enviado
          </option>
          <option value="Entregado">
            Entregado
          </option>
          <option value="Cancelado">
            Cancelado
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>Fecha desde:</label>
        <input v-model="dateFromFilter" type="date" @change="applyFilters">
      </div>
      <div class="filter-group">
        <label>Fecha hasta:</label>
        <input v-model="dateToFilter" type="date" @change="applyFilters">
      </div>
    </div>

    <!-- Tabla de pedidos -->
    <div class="table-container">
      <table v-if="filteredOrders.length > 0">
        <thead>
          <tr>
            <th @click="sortBy('id')">
              ID
            </th>
            <th @click="sortBy('orderDate')">
              Fecha
            </th>
            <th @click="sortBy('customer')">
              Cliente
            </th>
            <th @click="sortBy('total')">
              Total
            </th>
            <th @click="sortBy('status')">
              Estado
            </th>
            <th @click="sortBy('paymentStatus')">
              Pago
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ formatDate(order.orderDate) }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ formatCurrency(order.total) }}</td>
            <td>
              <span :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </td>
            <td>
              <span :class="getPaymentStatusClass(order.paymentStatus)">
                {{ order.paymentStatus }}
              </span>
            </td>
            <td>
              <button class="btn-view" @click="viewOrderDetails(order)">
                <i class="fas fa-eye" />
              </button>
              <button class="btn-edit" @click="editOrder(order)">
                <i class="fas fa-edit" />
              </button>
              <button class="btn-delete" @click="confirmDelete(order)">
                <i class="fas fa-trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-data">
        No se encontraron pedidos
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        &laquo; Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Siguiente &raquo;
      </button>
    </div>

    <!-- Modal para añadir/editar pedido -->
    <div v-if="showAddModal || showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModals">&times;</span>
        <h2>{{ showEditModal ? 'Editar Pedido' : 'Nuevo Pedido' }}</h2>
        <form @submit.prevent="showEditModal ? updateOrder() : addOrder()">
          <div class="form-group">
            <label for="customer">Cliente:</label>
            <input id="customer" v-model="orderForm.customer" type="text" required>
          </div>
          <div class="form-group">
            <label for="orderDate">Fecha del Pedido:</label>
            <input id="orderDate" v-model="orderForm.orderDate" type="date" required>
          </div>
          <div class="form-group">
            <label for="status">Estado:</label>
            <select id="status" v-model="orderForm.status">
              <option value="Pendiente">
                Pendiente
              </option>
              <option value="En Proceso">
                En Proceso
              </option>
              <option value="Enviado">
                Enviado
              </option>
              <option value="Entregado">
                Entregado
              </option>
              <option value="Cancelado">
                Cancelado
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="paymentStatus">Estado de Pago:</label>
            <select id="paymentStatus" v-model="orderForm.paymentStatus">
              <option value="Pendiente">
                Pendiente
              </option>
              <option value="Pagado">
                Pagado
              </option>
              <option value="Reembolsado">
                Reembolsado
              </option>
            </select>
          </div>

          <!-- Elementos del pedido -->
          <h3>Productos</h3>
          <div class="items-container">
            <div v-for="(item, index) in orderForm.items" :key="index" class="order-item">
              <div class="form-row">
                <div class="form-group form-group-small">
                  <label>Producto:</label>
                  <input v-model="item.product" type="text" required>
                </div>
                <div class="form-group form-group-small">
                  <label>Cantidad:</label>
                  <input v-model="item.quantity" type="number" min="1" required>
                </div>
                <div class="form-group form-group-small">
                  <label>Precio:</label>
                  <input v-model="item.price" type="number" min="0" step="0.01" required>
                </div>
                <button type="button" class="btn-remove" @click="removeItem(index)">
                  <i class="fas fa-times" />
                </button>
              </div>
            </div>
            <button type="button" class="btn-add-item" @click="addItem">
              <i class="fas fa-plus" /> Añadir Producto
            </button>
          </div>

          <div class="form-group">
            <label>Total: {{ formatCurrency(calculateTotal()) }}</label>
          </div>

          <div class="form-group">
            <label for="notes">Notas:</label>
            <textarea id="notes" v-model="orderForm.notes" rows="3" />
          </div>

          <div class="form-buttons">
            <button type="button" @click="closeModals">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              {{ showEditModal ? 'Actualizar' : 'Crear Pedido' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de detalles del pedido -->
    <div v-if="showDetailsModal" class="modal">
      <div class="modal-content details-modal">
        <span class="close" @click="showDetailsModal = false">&times;</span>
        <h2>Detalles del Pedido #{{ selectedOrder.id }}</h2>

        <div class="details-section">
          <div class="detail-row">
            <div class="detail-label">
              Cliente:
            </div>
            <div class="detail-value">
              {{ selectedOrder.customer }}
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              Fecha:
            </div>
            <div class="detail-value">
              {{ formatDate(selectedOrder.orderDate) }}
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              Estado:
            </div>
            <div class="detail-value">
              <span :class="getStatusClass(selectedOrder.status)">
                {{ selectedOrder.status }}
              </span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              Estado de Pago:
            </div>
            <div class="detail-value">
              <span :class="getPaymentStatusClass(selectedOrder.paymentStatus)">
                {{ selectedOrder.paymentStatus }}
              </span>
            </div>
          </div>
        </div>

        <h3>Productos</h3>
        <table class="details-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in selectedOrder.items" :key="index">
              <td>{{ item.product }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.price) }}</td>
              <td>{{ formatCurrency(item.quantity * item.price) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">
                <strong>Total:</strong>
              </td>
              <td><strong>{{ formatCurrency(selectedOrder.total) }}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div v-if="selectedOrder.notes" class="details-section">
          <h3>Notas</h3>
          <div class="notes-box">
            {{ selectedOrder.notes }}
          </div>
        </div>

        <div class="form-buttons">
          <button @click="showDetailsModal = false">
            Cerrar
          </button>
          <button class="btn-edit" @click="editFromDetails()">
            Editar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content delete-modal">
        <span class="close" @click="showDeleteModal = false">&times;</span>
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar el pedido #{{ orderToDelete?.id }}?</p>
        <div class="form-buttons">
          <button type="button" @click="showDeleteModal = false">
            Cancelar
          </button>
          <button type="button" class="btn-delete" @click="deleteOrder">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'principal',
  middleware: 'auth',
  data () {
    return {
      orders: [],
      filteredOrders: [],
      searchTerm: '',
      statusFilter: '',
      dateFromFilter: '',
      dateToFilter: '',
      sortKey: 'id',
      sortDir: 'asc',
      currentPage: 1,
      itemsPerPage: 10,
      showAddModal: false,
      showEditModal: false,
      showDetailsModal: false,
      showDeleteModal: false,
      orderForm: {
        id: null,
        customer: '',
        orderDate: '',
        status: 'Pendiente',
        paymentStatus: 'Pendiente',
        items: [],
        notes: '',
        total: 0
      },
      selectedOrder: {},
      orderToDelete: null
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage)
    },
    paginatedOrders () {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredOrders.slice(start, end)
    }
  },
  mounted () {
    this.fetchOrders()
    // Establecer la fecha actual como valor predeterminado para nuevos pedidos
    const today = new Date().toISOString().split('T')[0]
    this.orderForm.orderDate = today
  },
  methods: {
    fetchOrders () {
      // Aquí iría tu llamada a la API para obtener los pedidos
      // Por ahora usaremos datos de ejemplo
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)

      this.orders = [
        {
          id: 1,
          customer: 'Empresa ABC',
          orderDate: today.toISOString().split('T')[0],
          status: 'Pendiente',
          paymentStatus: 'Pendiente',
          total: 2500.50,
          items: [
            { product: 'Producto A', quantity: 5, price: 250.25 },
            { product: 'Producto B', quantity: 3, price: 333.00 }
          ],
          notes: 'Entregar en horario de mañana'
        },
        {
          id: 2,
          customer: 'Corporación XYZ',
          orderDate: yesterday.toISOString().split('T')[0],
          status: 'En Proceso',
          paymentStatus: 'Pagado',
          total: 1800.00,
          items: [
            { product: 'Producto C', quantity: 10, price: 180.00 }
          ],
          notes: ''
        },
        {
          id: 3,
          customer: 'Distribuidora 123',
          orderDate: lastWeek.toISOString().split('T')[0],
          status: 'Entregado',
          paymentStatus: 'Pagado',
          total: 4320.75,
          items: [
            { product: 'Producto A', quantity: 8, price: 250.25 },
            { product: 'Producto D', quantity: 4, price: 295.50 }
          ],
          notes: 'Cliente frecuente, incluir catálogo de nuevos productos'
        },
        {
          id: 4,
          customer: 'Tienda Local',
          orderDate: lastWeek.toISOString().split('T')[0],
          status: 'Cancelado',
          paymentStatus: 'Reembolsado',
          total: 950.00,
          items: [
            { product: 'Producto E', quantity: 2, price: 475.00 }
          ],
          notes: 'Cliente canceló por retraso en el envío'
        }
      ]
      this.filteredOrders = [...this.orders]
    },
    searchOrders () {
      this.applyFilters()
    },
    applyFilters () {
      // Filtrar por término de búsqueda
      let filtered = [...this.orders]

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter((order) => {
          return order.customer.toLowerCase().includes(term) ||
                 order.id.toString().includes(term)
        })
      }

      // Filtrar por estado
      if (this.statusFilter) {
        filtered = filtered.filter(order => order.status === this.statusFilter)
      }

      // Filtrar por rango de fechas
      if (this.dateFromFilter) {
        filtered = filtered.filter(order => order.orderDate >= this.dateFromFilter)
      }

      if (this.dateToFilter) {
        filtered = filtered.filter(order => order.orderDate <= this.dateToFilter)
      }

      this.filteredOrders = filtered
      this.currentPage = 1
    },
    sortBy (key) {
      if (this.sortKey === key) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortDir = 'asc'
      }

      this.filteredOrders.sort((a, b) => {
        let valA = a[key]
        let valB = b[key]

        // Si estamos ordenando por fecha, convertir a objetos de fecha para comparación
        if (key === 'orderDate') {
          valA = new Date(valA)
          valB = new Date(valB)
        }

        let comparison = 0
        if (valA > valB) {
          comparison = 1
        } else if (valA < valB) {
          comparison = -1
        }

        return this.sortDir === 'desc' ? comparison * -1 : comparison
      })
    },
    formatDate (dateString) {
      if (!dateString) { return '' }
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('es-ES', options)
    },
    formatCurrency (value) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(value)
    },
    changePage (page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    viewOrderDetails (order) {
      this.selectedOrder = { ...order }
      this.showDetailsModal = true
    },
    editOrder (order) {
      this.orderForm = JSON.parse(JSON.stringify(order)) // Deep copy
      this.showEditModal = true
    },
    editFromDetails () {
      this.orderForm = JSON.parse(JSON.stringify(this.selectedOrder))
      this.showDetailsModal = false
      this.showEditModal = true
    },
    confirmDelete (order) {
      this.orderToDelete = order
      this.showDeleteModal = true
    },
    addOrder () {
      // Calcular el total antes de guardar
      this.orderForm.total = this.calculateTotal()

      // Aquí iría tu llamada a la API para añadir el pedido
      const newOrder = {
        ...this.orderForm,
        id: this.orders.length > 0 ? Math.max(...this.orders.map(o => o.id)) + 1 : 1
      }
      this.orders.unshift(newOrder) // Añadir al principio
      this.applyFilters()
      this.resetForm()
      this.closeModals()
    },
    updateOrder () {
      // Calcular el total antes de guardar
      this.orderForm.total = this.calculateTotal()

      // Aquí iría tu llamada a la API para actualizar el pedido
      const index = this.orders.findIndex(o => o.id === this.orderForm.id)
      if (index !== -1) {
        this.orders[index] = { ...this.orderForm }
        this.applyFilters()
      }
      this.closeModals()
    },
    deleteOrder () {
      // Aquí iría tu llamada a la API para eliminar el pedido
      if (this.orderToDelete) {
        this.orders = this.orders.filter(o => o.id !== this.orderToDelete.id)
        this.applyFilters()
        this.showDeleteModal = false
        this.orderToDelete = null
      }
    },
    addItem () {
      this.orderForm.items.push({
        product: '',
        quantity: 1,
        price: 0
      })
    },
    removeItem (index) {
      this.orderForm.items.splice(index, 1)
    },
    calculateTotal () {
      return this.orderForm.items.reduce((sum, item) => {
        return sum + (item.quantity * item.price)
      }, 0)
    },
    closeModals () {
      this.showAddModal = false
      this.showEditModal = false
      this.showDetailsModal = false
      this.resetForm()
    },
    resetForm () {
      this.orderForm = {
        id: null,
        customer: '',
        orderDate: new Date().toISOString().split('T')[0],
        status: 'Pendiente',
        paymentStatus: 'Pendiente',
        items: [],
        notes: '',
        total: 0
      }
    },
    getStatusClass (status) {
      switch (status) {
        case 'Pendiente':
          return 'status-pending'
        case 'En Proceso':
          return 'status-processing'
        case 'Enviado':
          return 'status-shipped'
        case 'Entregado':
          return 'status-delivered'
        case 'Cancelado':
          return 'status-canceled'
        default:
          return ''
      }
    },
    getPaymentStatusClass (status) {
      switch (status) {
        case 'Pendiente':
          return 'payment-pending'
        case 'Pagado':
          return 'payment-paid'
        case 'Reembolsado':
          return 'payment-refunded'
        default:
          return ''
      }
    }
  }
}
</script>

<style scoped>
.orders-container {
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

.btn-add {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.search input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
}

/* Filtros */
.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-group select,
.filter-group input {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  cursor: pointer;
}

th:hover {
  background-color: #e0e0e0;
}

.btn-view,
.btn-edit,
.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 5px;
}

.btn-view {
  color: #673AB7;
}

.btn-edit {
  color: #2196F3;
}

.btn-delete {
  color: #F44336;
}

/* Estados de pedido */
.status-pending {
  color: #FF9800;
  font-weight: bold;
}

.status-processing {
  color: #2196F3;
  font-weight: bold;
}

.status-shipped {
  color: #9C27B0;
  font-weight: bold;
}

.status-delivered {
  color: #4CAF50;
  font-weight: bold;
}

.status-canceled {
  color: #F44336;
  font-weight: bold;
}

/* Estados de pago */
.payment-pending {
  color: #FF9800;
  font-weight: bold;
}

.payment-paid {
  color: #4CAF50;
  font-weight: bold;
}

.payment-refunded {
  color: #9E9E9E;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination button {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}

/* Modal styles */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.details-modal {
  width: 700px;
}

.delete-modal {
  width: 400px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Items de pedido */
.items-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
}

.order-item {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}

.order-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.form-group-small {
  flex: 1;
}

.btn-add-item {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-remove {
  background-color: #F44336;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  height: 36px;
}

/* Detalles del pedido */
.details-section {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
}

.detail-label {
  font-weight: bold;
  width: 150px;
}

.details-table {
  width: 100%;
  margin-bottom: 20px;
}

.text-right {
  text-align: right;
}

.notes-box {
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 60px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.form-buttons button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-submit {
  background-color: #4CAF50;
  color: white;
  border: none;
}
</style>
