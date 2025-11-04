<template>
  <div v-if="isOpen" class="cart-modal-container">
    <div class="cart-header">
      <h3>Shopping Cart</h3>
      <v-icon class="close-icon" @click="$emit('update:isOpen', false)">
        mdi-close
      </v-icon>
    </div>

    <hr class="divider">

    <div class="cart-body">
      <div v-if="cart.length === 0" class="empty-cart-message">
        Your cart is empty
      </div>
      <div v-else>
        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <img :src="item.image" class="cart-item-image" alt="Imagen del producto">
          <div class="cart-item-details">
            <p class="cart-item-name">
              {{ item.name }}
            </p>
            <p class="cart-item-qty">
              {{ item.quantity }} x
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
        <span>Subtotal</span>
        <span class="subtotal-amount">$ {{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="cart-buttons">
        <v-btn outlined class="view-cart" @click="$router.push('/cart')">
          View Cart
        </v-btn>
        <v-btn color="black" dark class="checkout" @click="handleCheckout">
          Checkout
        </v-btn>
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
    cargarCarrito () {
      const carrito = localStorage.getItem('carrito')
      this.cart = carrito ? JSON.parse(carrito) : []
    },
    handleCheckout () {
      if (this.cart.length === 0) {
        alert('Your cart is still empty.')
        return
      }

      this.$emit('update:isOpen', false)

      this.$nextTick(() => {
        this.$router.push('/checkout')
      })
    },
    eliminarProducto (index) {
      this.cart.splice(index, 1)
      localStorage.setItem('carrito', JSON.stringify(this.cart))
      window.dispatchEvent(new Event('carrito-actualizado'))
    }
  }
}
</script>

<style scoped>
.cart-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
}

.cart-modal-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  height: 50vh;
  background-color: white;
  border-radius: 10px 0 0 10px;
  box-shadow: -4px 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 99999;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 8px;
  font-weight: bold;
  font-size: 1.2rem;
  position: relative;
}

.close-icon {
  cursor: pointer;
}

.divider {
  width: 160px;
  margin: 0 0 8px 16px;
  border: none;
  border-top: 1px solid #ddd;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
}

.empty-cart-message {
  text-align: center;
  color: #888;
  padding: 40px 0;
}

.cart-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  position: relative;
}

.cart-item-name {
  font-weight: 500;
  margin: 0;
}

.cart-item-qty,
.cart-item-price {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
}

.cart-footer {
  padding: 16px;
  border-top: 1px solid #eee;
}

.subtotal {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 12px;
}

.subtotal-amount {
  color: #b08500;
}

.cart-buttons {
  display: flex;
  justify-content: center;
  gap: 35px;
}

.view-cart,
.checkout {
  border-radius: 25px;
  text-transform: none;
  font-weight: 600;
  padding: 8px 20px;
}

.remove-icon {
  position: absolute;
  bottom: 25px;
  right: 40px;
  cursor: pointer;
  color: #999;
  font-size: 20px;
  transition: color 0.2s;
}

.remove-icon:hover {
  color: #bbb;
}

@media (max-width: 600px) {
  .cart-modal-container {
    width: 100vw;
    right: 0;
    top: 0;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    box-shadow: none;
  }

  .cart-header {
    padding: 16px 12px;
  }

  .cart-body {
    padding: 16px 12px;
    max-height: calc(100vh - 250px);
  }

  .cart-footer {
    padding: 16px 12px;
  }

  .cart-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .view-cart,
  .checkout {
    width: 100%;
    justify-content: center;
  }
}
</style>

<style>
.v-application .container.fill-height.d-flex.justify-center.align-center {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
  background-color: transparent !important;
  border: none !important;
}
</style>
