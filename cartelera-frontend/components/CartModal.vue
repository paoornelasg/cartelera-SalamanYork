<template>
  <div v-if="isOpen" class="cart-overlay">
    <div class="cart-modal-container">
      <div class="cart-header">
        <div class="cart-header-bar">
          <div class="cart-header-left">
            <h3 class="cart-title">
              Carrito de compras
            </h3>
            <v-btn small text class="history-btn" @click="goToOrders">
              Ver historial
            </v-btn>
          </div>
          <v-icon class="close-icon" @click="$emit('update:isOpen', false)">
            mdi-close
          </v-icon>
        </div>
      </div>

      <div class="cart-body">
        <div v-if="cart.length === 0" class="empty-cart-message">
          Tu carrito está vacío
        </div>
        <div v-else>
          <div
            v-for="(item, index) in cart"
            :key="index"
            class="cart-item"
          >
            <img
              :src="item.image"
              class="cart-item-image"
              alt="Imagen del producto"
            >
            <div class="cart-item-details">
              <p class="cart-item-name">
                {{ item.name }}
              </p>
              <p class="cart-item-meta">
                {{ item.quantity }} boleto(s)
              </p>
              <p class="cart-item-meta">
                Función: {{ formatShowInfo(item) }}
              </p>
              <p class="cart-item-price">
                $ {{ Number(item.price).toFixed(2) }}
              </p>
              <v-icon class="remove-icon" @click="eliminarProducto(index)">
                mdi-close-circle
              </v-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-footer">
        <div class="subtotal">
          <span class="subtotal-label">Subtotal</span>
          <span class="subtotal-amount">$ {{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="cart-buttons">
          <v-btn
            class="view-cart"
            outlined
            color="#db133b"
            @click="$router.push('/cart')"
          >
            Ver carrito
          </v-btn>
          <v-btn
            class="checkout"
            color="#db133b"
            dark
            @click="handleCheckout"
          >
            Pagar
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      cart: []
    }
  },
  computed: {
    subtotal () {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }
  },
  watch: {
    isOpen (val) {
      if (val) {
        this.cargarCarrito()
      }
    }
  },
  mounted () {
    window.addEventListener('carrito-actualizado', this.cargarCarrito)
  },
  beforeDestroy () {
    window.removeEventListener('carrito-actualizado', this.cargarCarrito)
  },
  methods: {
    async cargarCarrito () {
      let user = null
      try { user = JSON.parse(localStorage.getItem('user') || 'null') } catch (e) { user = null }

      if (user && (user.id || user.uid)) {
        try {
          const userId = user.id || user.uid
          const { data } = await this.$axios.get(`http://localhost:5020/api/orders/cart/user/${userId}`)
          this.cart = (Array.isArray(data) ? data : []).map(it => ({
            name: it.movieTitle || it.name || '',
            image: it.poster || it.image || '',
            quantity: it.qty || it.quantity || 0,
            price: it.unitPrice || it.price || 0,
            id: it.id,
            cinema: it.cinema,
            format: it.format,
            showDate: it.showDate,
            showTime: it.showTime
          }))
          return
        } catch (err) {}
      }

      const carrito = localStorage.getItem('carrito')
      const dataLocal = carrito ? JSON.parse(carrito) : []
      this.cart = dataLocal.map(it => ({
        ...it,
        quantity: it.qty || it.quantity || 0,
        price: it.unitPrice || it.price || 0
      }))
    },

    handleCheckout () {
      if (this.cart.length === 0) {
        alert('Tu carrito todavía está vacío.')
        return
      }

      this.$emit('update:isOpen', false)

      this.$nextTick(() => {
        this.$router.push('/checkout')
      })
    },

    async eliminarProducto (index) {
      const item = this.cart[index]
      try {
        if (item && item.id) {
          await this.$axios.delete(`http://localhost:5020/api/orders/cart/item/${item.id}`)
        }
      } catch (err) {
        try { console.error('Error deleting server cart item', err.response?.data || err.message) } catch (e) {}
      }

      this.cart.splice(index, 1)
      localStorage.setItem('carrito', JSON.stringify(this.cart))
      this.$emit('update:isOpen', false)
      window.dispatchEvent(new Event('carrito-actualizado'))
    },

    goToOrders () {
      this.$emit('update:isOpen', false)
      this.$nextTick(() => {
        this.$router.push('/orders')
      })
    },

    formatShowInfo (item) {
      const parts = []
      if (item.cinema) { parts.push(item.cinema) }
      if (item.format) { parts.push(item.format) }
      if (item.showTime) { parts.push(item.showTime) }
      return parts.join(' • ')
    }
  }
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  background: rgba(0, 0, 0, 0.25);
}

.cart-modal-container {
  width: 380px;
  max-width: 100%;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: -4px 0 18px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  border-radius: 12px 0 0 12px;
  overflow: hidden;
}

.cart-header {
  width: 100%;
}

.cart-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #db133b;
  color: #ffffff;
  padding: 14px 18px;
}

.cart-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.history-btn {
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.18);
  padding: 6px 10px;
  text-transform: none;
  min-width: 0;
}

.cart-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.close-icon {
  cursor: pointer;
  color: #ffffff;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px 8px;
  background-color: #fafafa;
}

.empty-cart-message {
  text-align: center;
  color: #777;
  padding: 40px 0;
  font-size: 0.95rem;
}

.cart-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 10px 10px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.cart-item-image {
  width: 60px;
  height: 88px;
  object-fit: cover;
  border-radius: 6px;
}

.cart-item-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}

.cart-item-name {
  font-weight: 600;
  margin: 0 0 4px;
  font-size: 0.95rem;
  color: #1a1a1a;
}

.cart-item-meta {
  margin: 0;
  font-size: 0.8rem;
  color: #777;
}

.cart-item-price {
  margin: 8px 0 0;
  font-weight: 700;
  font-size: 0.95rem;
  color: #001f54;
}

.remove-icon {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  color: #c4c4c4;
  font-size: 20px;
  transition: color 0.2s, transform 0.1s;
}

.remove-icon:hover {
  color: #db133b;
  transform: scale(1.05);
}

.cart-footer {
  padding: 14px 18px 16px;
  border-top: 1px solid #eeeeee;
  background-color: #ffffff;
}

.subtotal {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 14px;
}

.subtotal-label {
  font-size: 0.95rem;
  color: #555;
}

.subtotal-amount {
  font-size: 1.15rem;
  font-weight: 800;
  color: #001f54;
}

.cart-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.view-cart,
.checkout {
  border-radius: 999px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 8px 20px;
  width: 100%;
  justify-content: center;
}

@media (max-width: 600px) {
  .cart-modal-container {
    width: 100%;
    border-radius: 0;
  }
}
</style>
