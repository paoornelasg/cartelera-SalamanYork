<template>
  <v-app>
    <v-main>
      <AppHeader />
      <ProductImage title="Cart" />
      <div class="cart-content-container">
        <div class="cart-content-left">
          <div class="cart-content-left-header">
            <div class="col-product">
              Product
            </div>
            <div class="col-price">
              Price
            </div>
            <div class="col-quantity">
              Quantity
            </div>
            <div class="col-subtotal">
              Subtotal
            </div>
            <div class="col-delete" />
          </div>
          <div v-if="carrito.length === 0" class="empty-cart-msg">
            Yout shopping cart is empty.
          </div>

          <div
            v-for="item in carrito"
            :key="item.id"
            class="cart-content-left-item"
          >
            <div class="col-product product-info">
              <img :src="item.image" alt="product">
              <span>{{ item.name }}</span>
            </div>

            <div class="col-price">
              ${{ item.price }}
            </div>

            <div class="col-quantity quantity-box">
              {{ item.quantity }}
            </div>

            <div class="col-subtotal subtotal-column">
              ${{ item.price * item.quantity }}
            </div>

            <div class="col-delete">
              <v-icon class="trash-icon" title="Eliminar producto" @click="confirmarEliminacion(item)">
                mdi-delete
              </v-icon>
            </div>
          </div>

          <div v-if="showModal" class="modal-overlay">
            <div class="modal-box">
              <p>Are you sure you want to delete this product?</p>
              <button @click="eliminarProducto(confirmItem)">
                Delete
              </button>
              <button @click="cancelarEliminacion">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div class="cart-content-right">
          <h3>Cart Totals</h3>

          <div class="cart-contents">
            <p>
              <span>Subtotal:</span>
              <span class="price">${{ subtotal }}</span>
            </p>
            <p>
              <span>Total:</span>
              <span class="price">${{ total }}</span>
            </p>
          </div>

          <button class="checkout-button" @click="checkout">
            Check&nbsp;Out
          </button>

          <p v-if="mensaje" class="ok-msg">
            {{ mensaje }}
          </p>
          <p v-if="error" class="err-msg">
            {{ error }}
          </p>
        </div>
      </div>

      <RoseSection />
      <PageFooter />
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import AppHeader from '~/components/PageHeader.vue'
import ProductImage from '~/components/ProductImage.vue'
import PageFooter from '~/components/PageFooter.vue'
import RoseSection from '~/components/RoseSection.vue'

export default {
  components: {
    AppHeader,
    ProductImage,
    RoseSection,
    PageFooter
  },
  data () {
    return {
      carrito: [],
      billing: { name: 'Pao', email: 'pao@example.com' },
      error: '',
      mensaje: '',
      showModal: false,
      confirmItem: null
    }
  },
  computed: {
    subtotal () {
      return this.carrito.reduce((s, it) => s + it.price * it.quantity, 0)
    },
    total () {
      return this.subtotal
    }
  },
  mounted () {
    this.cargarCarrito()
    window.addEventListener('storage', this.cargarCarrito)
  },
  beforeDestroy () {
    window.removeEventListener('storage', this.cargarCarrito)
  },
  methods: {
    confirmarEliminacion (item) {
      this.confirmItem = item
      this.showModal = true
    },
    cancelarEliminacion () {
      this.showModal = false
      this.confirmItem = null
    },
    eliminarProducto (item) {
      this.carrito = this.carrito.filter(p => p.id !== item.id)
      localStorage.setItem('carrito', JSON.stringify(this.carrito))
      this.showModal = false
      this.confirmItem = null
    },
    cargarCarrito () {
      const guardado = localStorage.getItem('carrito')
      this.carrito = guardado ? JSON.parse(guardado) : []
    },
    async checkout () {
      if (this.carrito.length === 0) {
        this.error = 'You cannot proceed to checkout because your cart is empty.'
        this.mensaje = ''
        return
      }

      this.$router.push('/checkout')

      try {
        await axios.post('http://localhost:5020/api/orders/checkout', {
          billing: this.billing,
          cart: this.carrito,
          totals: { subtotal: this.subtotal, total: this.total },
          paymentMethod: 'efectivo',
          notes: ''
        })
        this.mensaje = 'Order successfully created!'
        this.carrito = []
        localStorage.removeItem('carrito')
      } catch (err) {
        this.error = err.response?.data?.message || 'Error while creating the order'
      }
    }
  }
}
</script>

<style scoped>
.cart-content-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 50px;
  padding: 2rem 1rem;
  background: #f4f4f4;
  opacity: 0.8;
}

.cart-content-left {
  width: 700px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.cart-content-left-header {
  display: flex;
  align-items: center;
  background: #fff4d1;
  padding: 4px 0;
  gap: 20px;
}

.cart-content-left-header .col-product,
.cart-content-left-header .col-price,
.cart-content-left-header .col-quantity,
.cart-content-left-header .col-subtotal,
.cart-content-left-header .col-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  color: #444;
}

.cart-content-left-header p {
  margin: 0;
  text-align: center;
  font-weight: 600;
  padding: 12px 0;
}

.cart-content-left-item {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #e9e9e9;
  margin-bottom: 12px;
  margin-top: 12px;
}

.cart-content-left-item p {
  flex: 1;
  text-align: center;
  margin: 0;
  color: #666;
}

.price {
  color: #d4a02b;
  font-weight: 600;
}

.cart-content-right {
  background: #fff4d1;
  width: 300px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.cart-content-right h3 {
  margin: 0 0 1rem 0;
  font-weight: 700;
  font-size: 1.5rem;
}

.cart-contents {
  width: 100%;
}

.cart-contents p {
  display: flex;
  justify-content: space-between;
  margin: 0.3rem 0;
  font-size: 1rem;
}

.cart-contents p:first-of-type .price {
  font-size: 0.8rem;
  color: #666666;
  font-weight: 400;
}

.checkout-button {
  margin-top: 1.3rem;
  padding: 12px 25px;
  font-size: 1rem;
  border: 1px solid #111;
  border-radius: 15px;
  background: transparent;
  cursor: pointer;
}

.checkout-button:hover {
  background: #e8e6e6;
  transition: 0.2s;
}

.ok-msg { color: #2a952a; margin-top: 0.5rem; }
.err-msg { color: #d12222; margin-top: 0.5rem; }

.product-info img {
  display: inline-block;
  vertical-align: middle;
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info span {
  display: inline-block;
  line-height: 1.2;
  vertical-align: middle;
  color: #444;
  font-size: 1rem;
  font-weight: 500;
}

.quantity-box {
  display: inline-block;
  min-width: 40px;
  text-align: center;
  padding: 4px 10px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-weight: 500;
  background-color: transparent;
}

.subtotal-group {
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
}

.trash-icon {
  color: #d4a02b;
  font-size: 22px;
  cursor: pointer;
  margin-left: 10px;
}

.trash-icon:hover {
  color: #999;
}

.empty-cart-msg {
  text-align: center;
  width: 100%;
  padding: 40px 0;
  font-size: 1.3rem;
  text-transform: none;
  color: #666;
  font-weight: 400;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 15px;
  text-align: center;
  width: 90%;
  max-width: 400px;
}

.modal-box p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.modal-box button {
  margin: 0 0.5rem;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.modal-box button:first-of-type {
  background-color: #d4a02b;
  color: white;
}

.modal-box button:last-of-type {
  background-color: #e0e0e0;
}

.col-product {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.col-price {
  width: 15%;
  text-align: center;
}

.col-quantity {
  width: 15%;
  text-align: center;
}

.col-subtotal {
  width: 20%;
  text-align: center;
}

.col-delete {
  width: 10%;
  text-align: center;
}

.col-price,
.col-subtotal {
  color: #444;
  font-weight: 600;
}

.cart-content-left-header,
.cart-content-left-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #e9e9e9;
}

.col-product { width: 30%; display: flex; align-items: center; gap: 10px; }
.col-price { width: 15%; text-align: center; font-weight: 600; }
.col-quantity { width: 15%; text-align: center; }
.col-subtotal { width: 20%; text-align: center; font-weight: 600; color: #444; }
.col-delete { width: 10%; text-align: center; }

.col-product img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.col-product span {
  color: #444;
  font-size: 1rem;
  font-weight: 500;
}

.quantity-box {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 6px 12px;
  font-weight: 500;
  background-color: transparent;
}

.trash-icon {
  color: #d4a02b;
  font-size: 22px;
  cursor: pointer;
}

.trash-icon:hover {
  color: #999;
}

@media (max-width: 768px) {
  .cart-content-container {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 20px;
  }

  .cart-content-left {
    width: 100%;
  }

  .cart-content-right {
    width: 100%;
    padding: 1rem;
  }

  .cart-content-left-header {
    display: none;
  }

  .cart-content-left-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    margin-bottom: 16px;
    gap: 0.5rem;
  }

  .col-product,
  .col-price,
  .col-quantity,
  .col-subtotal,
  .col-delete {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .col-product {
    flex-direction: row;
    gap: 12px;
  }

  .col-product img {
    width: 50px;
    height: 50px;
  }

  .col-product span::before {
    content: "Product: ";
    font-weight: 600;
  }

  .col-price::before {
    content: "Price: ";
    font-weight: 600;
  }

  .col-quantity::before {
    content: "Quantity: ";
    font-weight: 600;
  }

  .col-subtotal::before {
    content: "Subtotal: ";
    font-weight: 600;
  }

  .col-delete {
    justify-content: flex-end;
  }

  .quantity-box {
    margin-left: auto;
  }

  .cart-content-right h3 {
    font-size: 1.2rem;
  }

  .checkout-button {
    width: 100%;
    font-size: 1rem;
  }
}

</style>
