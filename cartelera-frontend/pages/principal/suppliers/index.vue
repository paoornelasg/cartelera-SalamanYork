<template>
  <div class="suppliers-container">
    <div class="header">
      <h1>Gestión de Proveedores</h1>
      <div class="actions">
        <button class="btn-add" @click="showAddModal = true">
          <i class="fas fa-plus" /> Añadir Proveedor
        </button>
        <div class="search">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar proveedor..."
            @input="searchSuppliers"
          >
        </div>
      </div>
    </div>

    <!-- Tabla de proveedores -->
    <div class="table-container">
      <table v-if="filteredSuppliers.length > 0">
        <thead>
          <tr>
            <th @click="sortBy('id')">
              ID
            </th>
            <th @click="sortBy('name')">
              Nombre
            </th>
            <th @click="sortBy('contact')">
              Contacto
            </th>
            <th @click="sortBy('email')">
              Email
            </th>
            <th @click="sortBy('phone')">
              Teléfono
            </th>
            <th @click="sortBy('status')">
              Estado
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
            <td>{{ supplier.id }}</td>
            <td>{{ supplier.name }}</td>
            <td>{{ supplier.contact }}</td>
            <td>{{ supplier.email }}</td>
            <td>{{ supplier.phone }}</td>
            <td>
              <span :class="getStatusClass(supplier.status)">
                {{ supplier.status }}
              </span>
            </td>
            <td>
              <button class="btn-edit" @click="editSupplier(supplier)">
                <i class="fas fa-edit" />
              </button>
              <button class="btn-delete" @click="confirmDelete(supplier)">
                <i class="fas fa-trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-data">
        No se encontraron proveedores
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

    <!-- Modal para añadir/editar proveedor -->
    <div v-if="showAddModal || showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModals">&times;</span>
        <h2>{{ showEditModal ? 'Editar Proveedor' : 'Añadir Proveedor' }}</h2>
        <form @submit.prevent="showEditModal ? updateSupplier() : addSupplier()">
          <div class="form-group">
            <label for="name">Nombre:</label>
            <input id="name" v-model="supplierForm.name" type="text" required>
          </div>
          <div class="form-group">
            <label for="contact">Contacto:</label>
            <input id="contact" v-model="supplierForm.contact" type="text" required>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input id="email" v-model="supplierForm.email" type="email" required>
          </div>
          <div class="form-group">
            <label for="phone">Teléfono:</label>
            <input id="phone" v-model="supplierForm.phone" type="tel" required>
          </div>
          <div class="form-group">
            <label for="status">Estado:</label>
            <select id="status" v-model="supplierForm.status">
              <option value="Activo">
                Activo
              </option>
              <option value="Inactivo">
                Inactivo
              </option>
              <option value="Pendiente">
                Pendiente
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="address">Dirección:</label>
            <textarea id="address" v-model="supplierForm.address" rows="3" />
          </div>
          <div class="form-buttons">
            <button type="button" @click="closeModals">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              {{ showEditModal ? 'Actualizar' : 'Añadir' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content delete-modal">
        <span class="close" @click="showDeleteModal = false">&times;</span>
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar al proveedor {{ supplierToDelete?.name }}?</p>
        <div class="form-buttons">
          <button type="button" @click="showDeleteModal = false">
            Cancelar
          </button>
          <button type="button" class="btn-delete" @click="deleteSupplier">
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
      suppliers: [],
      filteredSuppliers: [],
      searchTerm: '',
      sortKey: 'id',
      sortDir: 'asc',
      currentPage: 1,
      itemsPerPage: 10,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      supplierForm: {
        id: null,
        name: '',
        contact: '',
        email: '',
        phone: '',
        status: 'Activo',
        address: ''
      },
      supplierToDelete: null
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.filteredSuppliers.length / this.itemsPerPage)
    },
    paginatedSuppliers () {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredSuppliers.slice(start, end)
    }
  },
  mounted () {
    this.fetchSuppliers()
  },
  methods: {
    fetchSuppliers () {
      // Aquí iría tu llamada a la API para obtener los proveedores
      // Por ahora usaremos datos de ejemplo
      this.suppliers = [
        { id: 1, name: 'Proveedor ABC', contact: 'Juan Pérez', email: 'juan@abc.com', phone: '555-1234', status: 'Activo', address: 'Calle Principal 123' },
        { id: 2, name: 'Suministros XYZ', contact: 'María López', email: 'maria@xyz.com', phone: '555-5678', status: 'Activo', address: 'Avenida Central 456' },
        { id: 3, name: 'Distribuidora 123', contact: 'Carlos Gómez', email: 'carlos@123.com', phone: '555-9012', status: 'Inactivo', address: 'Plaza Mayor 789' },
        { id: 4, name: 'Importadora Global', contact: 'Ana Martínez', email: 'ana@global.com', phone: '555-3456', status: 'Pendiente', address: 'Calle Secundaria 321' }
      ]
      this.filteredSuppliers = [...this.suppliers]
    },
    searchSuppliers () {
      if (!this.searchTerm) {
        this.filteredSuppliers = [...this.suppliers]
      } else {
        const term = this.searchTerm.toLowerCase()
        this.filteredSuppliers = this.suppliers.filter((supplier) => {
          return supplier.name.toLowerCase().includes(term) ||
                 supplier.contact.toLowerCase().includes(term) ||
                 supplier.email.toLowerCase().includes(term) ||
                 supplier.phone.includes(term)
        })
      }
      this.currentPage = 1
    },
    sortBy (key) {
      if (this.sortKey === key) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortDir = 'asc'
      }

      this.filteredSuppliers.sort((a, b) => {
        const valA = a[key]
        const valB = b[key]

        let comparison = 0
        if (valA > valB) {
          comparison = 1
        } else if (valA < valB) {
          comparison = -1
        }

        return this.sortDir === 'desc' ? comparison * -1 : comparison
      })
    },
    changePage (page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    editSupplier (supplier) {
      this.supplierForm = { ...supplier }
      this.showEditModal = true
    },
    confirmDelete (supplier) {
      this.supplierToDelete = supplier
      this.showDeleteModal = true
    },
    addSupplier () {
      // Aquí iría tu llamada a la API para añadir el proveedor
      const newSupplier = {
        ...this.supplierForm,
        id: this.suppliers.length > 0 ? Math.max(...this.suppliers.map(s => s.id)) + 1 : 1
      }
      this.suppliers.push(newSupplier)
      this.filteredSuppliers = [...this.suppliers]
      this.resetForm()
      this.closeModals()
    },
    updateSupplier () {
      // Aquí iría tu llamada a la API para actualizar el proveedor
      const index = this.suppliers.findIndex(s => s.id === this.supplierForm.id)
      if (index !== -1) {
        this.suppliers[index] = { ...this.supplierForm }
        this.filteredSuppliers = [...this.suppliers]
      }
      this.closeModals()
    },
    deleteSupplier () {
      // Aquí iría tu llamada a la API para eliminar el proveedor
      if (this.supplierToDelete) {
        this.suppliers = this.suppliers.filter(s => s.id !== this.supplierToDelete.id)
        this.filteredSuppliers = [...this.suppliers]
        this.showDeleteModal = false
        this.supplierToDelete = null
      }
    },
    closeModals () {
      this.showAddModal = false
      this.showEditModal = false
      this.resetForm()
    },
    resetForm () {
      this.supplierForm = {
        id: null,
        name: '',
        contact: '',
        email: '',
        phone: '',
        status: 'Activo',
        address: ''
      }
    },
    getStatusClass (status) {
      switch (status) {
        case 'Activo':
          return 'status-active'
        case 'Inactivo':
          return 'status-inactive'
        case 'Pendiente':
          return 'status-pending'
        default:
          return ''
      }
    }
  }
}
</script>

<style scoped>
.suppliers-container {
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

.btn-edit, .btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 5px;
}

.btn-edit {
  color: #2196F3;
}

.btn-delete {
  color: #F44336;
}

.status-active {
  color: #4CAF50;
  font-weight: bold;
}

.status-inactive {
  color: #F44336;
  font-weight: bold;
}

.status-pending {
  color: #FF9800;
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
  width: 500px;
  max-width: 90%;
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
