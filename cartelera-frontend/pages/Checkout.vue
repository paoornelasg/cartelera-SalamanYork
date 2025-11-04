<template>
  <v-app>
    <AppHeader />
    <ProductImage title="Checkout" />
    <v-main>
      <v-container class="checkout-container" fluid>
        <v-row class="pa-4" justify="center" style="max-width: 1300px; margin: auto;">
          <v-col cols="12" md="7">
            <h2 class="checkout-title">
              Billing details
            </h2>
            <v-form class="checkout-form">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="billing.firstName" label="First Name" outlined dense />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="billing.lastName" label="Last Name" outlined dense />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="billing.company" label="Company Name (Optional)" outlined dense />
                </v-col>
                <v-col cols="12">
                  <v-select v-model="billing.country" label="Country / Region" :items="countries" outlined dense />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="billing.address" label="Street address" outlined dense />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="billing.city" label="Town / City" outlined dense />
                </v-col>
                <v-col cols="12">
                  <v-select v-model="billing.province" label="Province" :items="provinces" outlined dense />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="billing.zip" label="ZIP code" outlined dense />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="billing.phone" label="Phone" outlined dense />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="billing.email" label="Email address" outlined dense />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="billing.notes" label="Additional information" outlined dense />
                </v-col>
              </v-row>
            </v-form>
          </v-col>
          <v-col cols="12" md="5">
            <div class="order-summary">
              <h3>Product</h3>
              <div v-for="item in carrito" :key="item.id" class="d-flex justify-space-between">
                <span>
                  <span class="text-grey darken-1">{{ item.name }}</span>
                  <span class="font-weight-medium"> × {{ item.quantity }}</span>
                </span>
                <span class="text-right">${{ (item.price * item.quantity).toLocaleString() }}</span>
              </div>

              <v-divider class="my-3" />

              <div class="d-flex justify-space-between">
                <strong>Subtotal</strong>
                ${{ subtotal.toLocaleString() }}
              </div>

              <div class="d-flex justify-space-between align-center">
                <strong>Total</strong>
                <strong class="text-h5 font-weight-bold amber--text text--darken-2">
                  ${{ total.toLocaleString() }}
                </strong>
              </div>

              <v-radio-group v-model="paymentMethod" class="mt-5 custom-radio-group" color="black">
                <v-radio
                  label="Direct Bank Transfer"
                  value="bank"
                  class="payment-option"
                />
                <div v-if="paymentMethod === 'bank'" class="payment-description">
                  Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                  Your order will not be shipped until the funds have cleared in our account.
                </div>

                <v-radio
                  label="Cash On Delivery"
                  value="cash"
                  class="payment-option"
                />
              </v-radio-group>

              <div class="privacy-note">
                Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our
                <a href="/" class="privacy-link">privacy policy</a>.
              </div>

              <v-btn color="black" class="mt-4 place-order-btn white-btn" @click="checkout">
                Place order
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="dialogSuccess" max-width="400">
        <v-card>
          <v-card-title class="headline">
            Order placed!
          </v-card-title>
          <v-card-text>
            Your order has been placed successfully. Thank you!
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="black" text @click="dialogSuccess = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogError" max-width="400">
        <v-card>
          <v-card-title class="headline">
            Oops!
          </v-card-title>
          <v-card-text>{{ errorMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="black" text @click="dialogError = false">
              Close
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
import ProductImage from '~/components/ProductImage.vue'

export default {
  components: {
    AppHeader,
    PageFooter,
    RoseSection,
    ProductImage
  },
  data () {
    return {
      billing: {
        firstName: '',
        lastName: '',
        company: '',
        country: 'Mexico',
        address: '',
        city: '',
        province: '',
        zip: '',
        phone: '',
        email: '',
        notes: ''
      },
      countries: ['Mexico', 'USA', 'Canada'],
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
      return this.carrito.reduce((acc, item) => acc + item.price * item.quantity, 0)
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
        this.errorMessage = 'Your cart is empty.'
        this.dialogError = true
        return
      }

      if (!this.billing.email) {
        this.errorMessage = 'Please enter your email address.'
        this.dialogError = true
        return
      }

      try {
        await axios.post('http://localhost:5020/api/orders/checkout', {
          billing: this.billing,
          cart: this.carrito,
          totals: { subtotal: this.subtotal, total: this.total },
          paymentMethod: this.paymentMethod
        })

        this.dialogSuccess = true
        localStorage.removeItem('carrito')
        this.carrito = []
      } catch (err) {
        console.error('Checkout failed:', err)
        this.errorMessage = 'There was a problem placing the order.'
        this.dialogError = true
      }
    }
  }
}
</script>

<style scoped>
.checkout-container {
  background: #fff;
  padding: 20px 10px;
}

.checkout-title {
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 50px;
}

.order-summary {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.order-summary span {
  font-size: 0.95rem;
  color: #444;
}

.order-summary .text-h5 {
  font-size: 1.2rem !important;
}

.payment-option {
  font-weight: 600;
  color: #444 !important;
}

.payment-description {
  font-size: 0.875rem;
  color: #888;
  margin-top: -10px;
  margin-bottom: 16px;
  margin-left: 32px;
  line-height: 1.5;
  max-width: 90%;
}

.privacy-note {
  font-size: 0.875rem;
  color: #888;
  margin-top: 4px;
  padding-left: auto;
  padding-right: auto;
  padding: 0;
  width: fit-content;
  text-align: left;
  line-height: 1.5;
}

.privacy-link {
  color: #000;
  font-weight: 600;
  text-decoration: none;
}

.place-order-btn {
  border-radius: 30px;
  padding: 20px 32px;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 0.9rem;
  min-width: 160px;
  background-color: white !important;
  color: black !important;
  border: 1.5px solid black;
  margin: 0 auto;
  display: block;
  box-shadow: none !important;
}

.place-order-btn:hover {
  background-color: #f1f1f1;
}

::v-deep(.v-col) {
  margin-bottom: 8px !important;
}

::v-deep(.v-input.outlined) {
  border-radius: 12px !important;
  min-height: 52px !important;
}

::v-deep(.v-input__slot) {
  min-height: 60px !important;
  border-radius: 12px !important;
}

::v-deep(.checkout-form .v-col[class*="col-"]) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  margin-bottom: 4px !important;
}

::v-deep(.checkout-form .v-input),
::v-deep(.checkout-form .v-text-field),
::v-deep(.checkout-form .v-select),
::v-deep(.checkout-form .v-textarea) {
  margin-bottom: 4px !important;
}

::v-deep(.checkout-form .v-input__control) {
  padding-bottom: 2px !important;
  padding-top: 2px !important;
}

@media (max-width: 600px) {
  .place-order-btn {
    width: 100%;
    justify-content: center;
    border-radius: 20px;
  }
}
</style>

<style>
.v-application .primary--text {
  color: #000 !important;
  caret-color: #000 !important;
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
