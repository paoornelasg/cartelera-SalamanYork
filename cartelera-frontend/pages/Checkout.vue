<template>
  <v-app>
    <AppHeader />
    <ProductImage title="Checkout" />
    <v-main>
      <v-container class="checkout-container" fluid>
        <v-row
          class="pa-4 checkout-layout"
          justify="center"
        >
          <!-- Columna izquierda con datos de facturación -->
          <v-col cols="12" md="7">
            <h2 class="checkout-title">
              Detalles de facturación
            </h2>

            <v-form class="checkout-form">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="billing.firstName"
                    label="Nombre"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="billing.lastName"
                    label="Apellido"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="billing.company"
                    label="Nombre de la empresa (opcional)"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="billing.country"
                    :items="countries"
                    label="País / Región"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="billing.address"
                    label="Dirección"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="billing.city"
                    label="Ciudad"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="billing.province"
                    :items="provinces"
                    label="Estado / Provincia"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="billing.zip"
                    label="Código postal"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="billing.phone"
                    label="Teléfono"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="billing.email"
                    label="Correo electrónico"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="billing.notes"
                    label="Información adicional"
                    outlined
                    dense
                    rows="3"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-col>

          <!-- Columna derecha: resumen de orden -->
          <v-col cols="12" md="5">
            <div class="order-summary">
              <h3 class="order-summary-title">
                Resumen del pedido
              </h3>

              <div
                v-for="item in carrito"
                :key="item.id"
                class="order-item d-flex justify-space-between"
              >
                <span>
                  <span class="order-item-name">{{ item.name }}</span>
                  <span class="order-item-qty"> × {{ item.quantity }}</span>
                </span>
                <span class="order-item-price">
                  ${{ (item.price * item.quantity).toLocaleString() }}
                </span>
              </div>

              <v-divider class="my-3" />

              <div class="d-flex justify-space-between order-subtotal">
                <strong>Subtotal</strong>
                <span>${{ subtotal.toLocaleString() }}</span>
              </div>

              <div class="d-flex justify-space-between align-center order-total">
                <strong>Total</strong>
                <strong class="order-total-amount">
                  ${{ total.toLocaleString() }}
                </strong>
              </div>

              <!-- Métodos de pago -->
              <v-radio-group
                v-model="paymentMethod"
                class="mt-5 custom-radio-group"
                color="red darken-2"
              >
                <v-radio
                  label="Transferencia bancaria directa"
                  value="bank"
                  class="payment-option"
                />

                <div
                  v-if="paymentMethod === 'bank'"
                  class="payment-description"
                >
                  Realiza tu pago directamente en nuestra cuenta bancaria.
                  Utiliza tu ID de orden como referencia de pago. Tu pedido no
                  se procesará hasta que los fondos se hayan acreditado.
                </div>

                <v-radio
                  label="Pago contra entrega"
                  value="cash"
                  class="payment-option"
                />
              </v-radio-group>

              <div class="privacy-note">
                Tus datos personales se utilizarán para gestionar tu pedido,
                mejorar tu experiencia en el sitio y otros fines descritos en
                nuestra
                <a href="/" class="privacy-link">política de privacidad</a>.
              </div>

              <v-btn
                color="red darken-2"
                class="mt-4 place-order-btn"
                @click="checkout"
              >
                Confirmar pedido
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- Modal éxito -->
      <v-dialog v-model="dialogSuccess" max-width="400">
        <v-card>
          <v-card-title class="headline">
            ¡Pedido realizado!
          </v-card-title>
          <v-card-text>
            Tu pedido se ha registrado correctamente. ¡Gracias por tu compra!
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="red darken-2" text @click="dialogSuccess = false">
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal error -->
      <v-dialog v-model="dialogError" max-width="400">
        <v-card>
          <v-card-title class="headline">
            ¡Ups!
          </v-card-title>
          <v-card-text>
            {{ errorMessage }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="red darken-2" text @click="dialogError = false">
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <RoseSection />
      <PageFooter />
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import AppHeader from '~/components/PageHeader.vue'
import PageFooter from '~/components/PageFooter.vue'
import RoseSection from '~/components/RoseSection.vue'
import PageHeader from '~/components/PageHeader.vue'

export default {
  components: {
    AppHeader,
    PageFooter,
    RoseSection,
    PageHeader
  },
  data () {
    return {
      billing: {
        firstName: '',
        lastName: '',
        company: '',
        country: 'México',
        address: '',
        city: '',
        province: '',
        zip: '',
        phone: '',
        email: '',
        notes: ''
      },
      countries: ['México', 'Estados Unidos', 'Canadá'],
      provinces: ['Guanajuato', 'CDMX', 'Jalisco', 'Nuevo León'],
      carrito: [],
      paymentMethod: 'bank',
      dialogSuccess: false,
      dialogError: false,
      errorMessage: ''
    }
  },
  computed: {
    subtotal () {
      return this.carrito.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
    },
    total () {
      return this.subtotal
    }
  },
  mounted () {
    const saved = localStorage.getItem('carrito')
    this.carrito = saved ? JSON.parse(saved) : []
  },
  methods: {
    async checkout () {
        if (this.carrito.length === 0) {
        this.errorMessage = 'Tu carrito está vacío.'
        this.dialogError = true
        return
        }

        if (!this.billing.email) {
        this.errorMessage = 'Por favor ingresa tu correo electrónico.'
        this.dialogError = true
        return
        }

        const token = localStorage.getItem('token')

        if (!token) {
        this.errorMessage = 'Usuario no autenticado. Inicia sesión para completar tu pedido.'
        this.dialogError = true
        return
        }

        try {
            await axios.post(
                'http://localhost:5020/api/orders/checkout',
                {
                billing: this.billing,
                cart: this.carrito,
                totals: { subtotal: this.subtotal, total: this.total },
                paymentMethod: this.paymentMethod
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
                }
            )

            this.dialogSuccess = true
            localStorage.removeItem('carrito')
            this.carrito = []
            } catch (err) {
            console.error('Checkout failed:', err)

            if (err.response && err.response.status === 401) {
                this.errorMessage = err.response.data?.message || 'Usuario no autenticado.'
            } else {
                this.errorMessage = 'Hubo un problema al procesar tu pedido.'
            }

            this.dialogError = true
            }
        }
    }
}
</script>

<style scoped>
.checkout-container {
  background: #fff9f9;
  padding: 24px 10px 40px;
}

.checkout-layout {
  max-width: 1300px;
  margin: auto;
}

.checkout-title {
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 32px;
  color: #b71c1c;
}

.order-summary {
  background: #ffffff;
  padding: 20px 24px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(183, 28, 28, 0.12);
  border-top: 4px solid #c62828;
}

.order-summary-title {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 16px;
  color: #b71c1c;
}

.order-item {
  margin-bottom: 8px;
}

.order-item-name {
  font-size: 0.95rem;
  color: #444;
}

.order-item-qty {
  font-weight: 600;
  color: #c62828;
}

.order-item-price {
  font-size: 0.95rem;
  color: #333;
}

.order-subtotal span:last-child {
  font-weight: 500;
}

.order-total {
  margin-top: 8px;
}

.order-total-amount {
  font-size: 1.2rem;
  color: #b71c1c;
}

.payment-option {
  font-weight: 600;
  color: #444 !important;
}

.payment-description {
  font-size: 0.85rem;
  color: #888;
  margin-top: -10px;
  margin-bottom: 16px;
  margin-left: 32px;
  line-height: 1.5;
  max-width: 90%;
}

.privacy-note {
  font-size: 0.85rem;
  color: #777;
  margin-top: 8px;
  line-height: 1.5;
}

.privacy-link {
  color: #b71c1c;
  font-weight: 600;
  text-decoration: none;
}

.privacy-link:hover {
  text-decoration: underline;
}

.place-order-btn {
  border-radius: 30px;
  padding: 14px 32px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  min-width: 180px;
  background-color: #c62828 !important;
  color: #fff !important;
  box-shadow: none !important;
}

.place-order-btn:hover {
  background-color: #b71c1c !important;
}

::v-deep(.checkout-form .v-col[class*='col-']) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-bottom: 6px !important;
}

::v-deep(.checkout-form .v-input__slot) {
  min-height: 52px !important;
  border-radius: 10px !important;
}

@media (max-width: 960px) {
  .checkout-container {
    padding-top: 16px;
  }

  .order-summary {
    margin-top: 16px;
  }
}

@media (max-width: 600px) {
  .place-order-btn {
    width: 100%;
    border-radius: 20px;
  }
}
</style>

<style>
.v-application .primary--text {
  color: #b71c1c !important;
  caret-color: #b71c1c !important;
}

.v-radio .v-icon {
  font-size: 18px !important;
}

.v-radio .v-input--selection-controls__ripple {
  width: 18px !important;
  height: 18px !important;
}

.v-input--selection-controls__ripple::before {
  display: none !important;
}
</style>