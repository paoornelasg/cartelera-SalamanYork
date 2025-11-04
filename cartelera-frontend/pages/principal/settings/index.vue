<template>
  <div class="settings-container">
    <div class="header">
      <h1>Configuración del Sistema</h1>
      <div class="actions">
        <button class="btn-save" @click="saveSettings">
          <i class="fas fa-save" /> Guardar Cambios
        </button>
      </div>
    </div>

    <!-- Secciones de configuración -->
    <div class="settings-sections">
      <!-- Navegación lateral -->
      <div class="settings-nav">
        <div
          v-for="(section, index) in sections"
          :key="index"
          :class="['nav-item', { active: activeSection === index }]"
          @click="activeSection = index"
        >
          <i :class="section.icon" />
          {{ section.name }}
        </div>
      </div>

      <!-- Contenido de la sección activa -->
      <div class="settings-content">
        <!-- Configuración General -->
        <div v-if="activeSection === 0" class="settings-section">
          <h2>Configuración General</h2>

          <div class="form-group">
            <label for="companyName">Nombre de la Empresa:</label>
            <input id="companyName" v-model="settings.general.companyName" type="text">
          </div>

          <div class="form-group">
            <label for="email">Email de Contacto:</label>
            <input id="email" v-model="settings.general.email" type="email">
          </div>

          <div class="form-group">
            <label for="phone">Teléfono de Contacto:</label>
            <input id="phone" v-model="settings.general.phone" type="tel">
          </div>

          <div class="form-group">
            <label for="address">Dirección:</label>
            <textarea id="address" v-model="settings.general.address" rows="3" />
          </div>

          <div class="form-group">
            <label for="timezone">Zona Horaria:</label>
            <select id="timezone" v-model="settings.general.timezone">
              <option value="Europe/Madrid">
                Europe/Madrid (UTC+1)
              </option>
              <option value="Europe/London">
                Europe/London (UTC+0)
              </option>
              <option value="America/New_York">
                America/New_York (UTC-5)
              </option>
              <option value="America/Los_Angeles">
                America/Los_Angeles (UTC-8)
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="dateFormat">Formato de Fecha:</label>
            <select id="dateFormat" v-model="settings.general.dateFormat">
              <option value="DD/MM/YYYY">
                DD/MM/YYYY
              </option>
              <option value="MM/DD/YYYY">
                MM/DD/YYYY
              </option>
              <option value="YYYY-MM-DD">
                YYYY-MM-DD
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="language">Idioma del Sistema:</label>
            <select id="language" v-model="settings.general.language">
              <option value="es">
                Español
              </option>
              <option value="en">
                English
              </option>
              <option value="fr">
                Français
              </option>
            </select>
          </div>
        </div>

        <!-- Configuración de Pedidos -->
        <div v-if="activeSection === 1" class="settings-section">
          <h2>Configuración de Pedidos</h2>

          <div class="form-group">
            <label for="orderPrefix">Prefijo de Pedido:</label>
            <input id="orderPrefix" v-model="settings.orders.orderPrefix" type="text">
          </div>

          <div class="form-group">
            <label for="itemsPerPage">Elementos por Página:</label>
            <select id="itemsPerPage" v-model="settings.orders.itemsPerPage">
              <option value="5">
                5
              </option>
              <option value="10">
                10
              </option>
              <option value="20">
                20
              </option>
              <option value="50">
                50
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="defaultStatus">Estado Predeterminado:</label>
            <select id="defaultStatus" v-model="settings.orders.defaultStatus">
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
            </select>
          </div>

          <div class="form-group">
            <label for="defaultPaymentStatus">Estado de Pago Predeterminado:</label>
            <select id="defaultPaymentStatus" v-model="settings.orders.defaultPaymentStatus">
              <option value="Pendiente">
                Pendiente
              </option>
              <option value="Pagado">
                Pagado
              </option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <input id="sendEmailNotifications" v-model="settings.orders.sendEmailNotifications" type="checkbox">
            <label for="sendEmailNotifications">Enviar notificaciones por email</label>
          </div>

          <div class="form-group checkbox-group">
            <input id="autoUpdateInventory" v-model="settings.orders.autoUpdateInventory" type="checkbox">
            <label for="autoUpdateInventory">Actualizar inventario automáticamente</label>
          </div>
        </div>

        <!-- Configuración de Facturación -->
        <div v-if="activeSection === 2" class="settings-section">
          <h2>Configuración de Facturación</h2>

          <div class="form-group">
            <label for="currency">Moneda:</label>
            <select id="currency" v-model="settings.billing.currency">
              <option value="EUR">
                Euro (€)
              </option>
              <option value="USD">
                Dólar (US$)
              </option>
              <option value="GBP">
                Libra Esterlina (£)
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="taxRate">IVA (%):</label>
            <input
              id="taxRate"
              v-model="settings.billing.taxRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
            >
          </div>

          <div class="form-group">
            <label for="invoicePrefix">Prefijo de Factura:</label>
            <input id="invoicePrefix" v-model="settings.billing.invoicePrefix" type="text">
          </div>

          <div class="form-group">
            <label for="paymentTerms">Términos de Pago (días):</label>
            <input id="paymentTerms" v-model="settings.billing.paymentTerms" type="number" min="0">
          </div>

          <div class="form-group">
            <label for="bankAccount">Cuenta Bancaria:</label>
            <input id="bankAccount" v-model="settings.billing.bankAccount" type="text">
          </div>

          <div class="form-group">
            <label for="invoiceNotes">Notas de Factura:</label>
            <textarea id="invoiceNotes" v-model="settings.billing.invoiceNotes" rows="3" />
          </div>
        </div>

        <!-- Configuración de Usuario -->
        <div v-if="activeSection === 3" class="settings-section">
          <h2>Configuración de Usuario</h2>

          <div class="form-group">
            <label for="username">Nombre de Usuario:</label>
            <input id="username" v-model="settings.user.username" type="text">
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input id="email" v-model="settings.user.email" type="email">
          </div>

          <div class="form-group">
            <label for="currentPassword">Contraseña Actual:</label>
            <input id="currentPassword" v-model="settings.user.currentPassword" type="password">
          </div>

          <div class="form-group">
            <label for="newPassword">Nueva Contraseña:</label>
            <input id="newPassword" v-model="settings.user.newPassword" type="password">
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña:</label>
            <input id="confirmPassword" v-model="settings.user.confirmPassword" type="password">
          </div>

          <div class="form-group checkbox-group">
            <input id="twoFactorAuth" v-model="settings.user.twoFactorAuth" type="checkbox">
            <label for="twoFactorAuth">Activar autenticación en dos pasos</label>
          </div>
        </div>

        <!-- Configuración de Notificaciones -->
        <div v-if="activeSection === 4" class="settings-section">
          <h2>Configuración de Notificaciones</h2>

          <h3>Notificaciones por Email</h3>
          <div class="form-group checkbox-group">
            <input id="emailNewOrder" v-model="settings.notifications.email.newOrder" type="checkbox">
            <label for="emailNewOrder">Nuevo pedido</label>
          </div>

          <div class="form-group checkbox-group">
            <input id="emailOrderStatus" v-model="settings.notifications.email.orderStatus" type="checkbox">
            <label for="emailOrderStatus">Cambio de estado de pedido</label>
          </div>

          <div class="form-group checkbox-group">
            <input id="emailPayment" v-model="settings.notifications.email.payment" type="checkbox">
            <label for="emailPayment">Pago recibido</label>
          </div>

          <h3>Notificaciones del Sistema</h3>
          <div class="form-group checkbox-group">
            <input id="systemLowStock" v-model="settings.notifications.system.lowStock" type="checkbox">
            <label for="systemLowStock">Inventario bajo</label>
          </div>

          <div class="form-group checkbox-group">
            <input id="systemOrderDelay" v-model="settings.notifications.system.orderDelay" type="checkbox">
            <label for="systemOrderDelay">Retraso en pedido</label>
          </div>

          <div class="form-group checkbox-group">
            <input id="systemNewMessage" v-model="settings.notifications.system.newMessage" type="checkbox">
            <label for="systemNewMessage">Nuevo mensaje</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de cambios guardados -->
    <div v-if="showSavedModal" class="modal">
      <div class="modal-content saved-modal">
        <span class="close" @click="showSavedModal = false">&times;</span>
        <div class="success-message">
          <i class="fas fa-check-circle" />
          <h2>Configuración Guardada</h2>
          <p>Tus cambios han sido guardados correctamente.</p>
        </div>
        <div class="form-buttons">
          <button type="button" @click="showSavedModal = false">
            Aceptar
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
      activeSection: 0,
      showSavedModal: false,
      sections: [
        { name: 'General', icon: 'fas fa-cog' },
        { name: 'Pedidos', icon: 'fas fa-shopping-cart' },
        { name: 'Facturación', icon: 'fas fa-file-invoice-dollar' },
        { name: 'Usuario', icon: 'fas fa-user' },
        { name: 'Notificaciones', icon: 'fas fa-bell' }
      ],
      settings: {
        general: {
          companyName: 'Mi Empresa S.L.',
          email: 'contacto@miempresa.com',
          phone: '+34 612 345 678',
          address: 'Calle Principal, 123\n28001 Madrid, España',
          timezone: 'Europe/Madrid',
          dateFormat: 'DD/MM/YYYY',
          language: 'es'
        },
        orders: {
          orderPrefix: 'PED-',
          itemsPerPage: '10',
          defaultStatus: 'Pendiente',
          defaultPaymentStatus: 'Pendiente',
          sendEmailNotifications: true,
          autoUpdateInventory: true
        },
        billing: {
          currency: 'EUR',
          taxRate: 21,
          invoicePrefix: 'FACT-',
          paymentTerms: 30,
          bankAccount: 'ES12 3456 7890 1234 5678 9012',
          invoiceNotes: 'Gracias por confiar en nosotros. Pago a 30 días desde la fecha de emisión.'
        },
        user: {
          username: 'administrador',
          email: 'admin@miempresa.com',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          twoFactorAuth: false
        },
        notifications: {
          email: {
            newOrder: true,
            orderStatus: true,
            payment: true
          },
          system: {
            lowStock: true,
            orderDelay: true,
            newMessage: true
          }
        }
      }
    }
  },
  methods: {
    saveSettings () {
      // Aquí iría tu llamada a la API para guardar la configuración
      // Simulamos un pequeño retardo para la demostración
      setTimeout(() => {
        this.showSavedModal = true
      }, 500)
    }
  }
}
</script>

<style scoped>
.settings-container {
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

.btn-save {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.settings-sections {
  display: flex;
  gap: 20px;
  min-height: 500px;
}

.settings-nav {
  width: 200px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.nav-item {
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-item:hover {
  background-color: #e0e0e0;
}

.nav-item.active {
  background-color: #2196F3;
  color: white;
}

.nav-item i {
  margin-right: 8px;
}

.settings-content {
  flex: 1;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
}

.settings-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.settings-section h3 {
  margin-top: 20px;
  margin-bottom: 10px;
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

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input {
  width: auto;
  margin-right: 8px;
}

.checkbox-group label {
  margin-bottom: 0;
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
  width: 400px;
  max-width: 90%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.success-message {
  text-align: center;
  padding: 20px 0;
}

.success-message i {
  font-size: 48px;
  color: #4CAF50;
  margin-bottom: 10px;
}

.form-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.form-buttons button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
