<template>
  <v-app>
    <AppHeader />
    <v-main>
      <v-container class="orders-container" fluid>
        <div class="orders-inner">
          <h1 class="orders-title">
            Historial de Compras
          </h1>
          <div v-if="loading">
            Cargando...
          </div>
          <div v-if="!loading && groups.length === 0">
            No tienes compras registradas.
          </div>

          <div v-for="group in groups" :key="group.id" class="order-card">
            <!--<h3>Compra: {{ group.id }} — {{ formatDate(group.paidAt) }} — Total: ${{ group.total.toFixed(2) }}</h3>-->
            <h3 style="font-size: 25px;">
              Compra: {{ formatDate(group.paidAt) }} — Total: ${{ group.total.toFixed(2) }}
            </h3>
            <div v-for="item in group.items" :key="item.id" class="order-item d-flex align-center" style="gap:16px;">
              <img
                :src="item.poster || item.image || '/images/default_movie.png'"
                alt="poster"
                class="order-item-poster"
              >
              <div style="flex:1">
                <p style="margin:0 0 6px">
                  <strong>
                    {{ item.movieTitle || item.name }}
                  </strong>
                </p>
                <p style="margin:0 0 6px">
                  Cine: {{ item.cinema }} — Función: {{ formatDate(item.showDate) }} {{ item.showTime }}
                </p>
                <p style="margin:0">
                  Cantidad: {{ item.qty || item.quantity }} — Precio unitario: ${{ Number(item.unitPrice || item.price || 0).toFixed(2) }}
                </p>
              </div>
          </div>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from '~/components/PageHeader.vue'

export default {
  components: { AppHeader },
  data () {
    return {
      orders: [],
      groups: [],
      loading: true
    }
  },
  mounted () {
    this.loadOrders()
  },
  methods: {
    formatDate (v) {
      if (!v) { return '' }
      try {
        const d = new Date(Number(v))
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
      } catch (e) { return v }
    },
    async loadOrders () {
      const rawUser = localStorage.getItem('user')
      if (!rawUser) {
        this.orders = []
        this.loading = false
        return this.$router.push('/')
      }
      const user = JSON.parse(rawUser)
      try {
        const res = await this.$axios.get(`/orders/user/${user.id || user.usuario || user.uid}`)
        // Filtrar artículos del carrito (mantener comprados/pagados/otros)
        this.orders = (res.data || []).filter(o => o.status !== 'cart')

        // Agrupar por purchaseId; si no existe, usar una key legacy por minuto
        const groupsMap = this.orders.reduce((acc, o) => {
          const ts = Number(o.paidAt || o.updatedAt || o.createdAt || Date.now())
          const pid = o.purchaseId || `legacy_${Math.floor(ts / 60000)}`
          if (!acc[pid]) {
            acc[pid] = { id: pid, paidAt: ts, items: [], total: 0 }
          }
          const qty = Number(o.qty || o.quantity || 1)
          const price = Number(o.unitPrice || o.price || 0)
          acc[pid].items.push(o)
          acc[pid].total += qty * price
          return acc
        }, {})

        this.groups = Object.values(groupsMap).sort((a, b) => b.paidAt - a.paidAt)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load orders', err)
        this.orders = []
        this.groups = []
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.orders-container {
  max-width: 900px;
  margin: 2rem auto;
  margin-top: 70px;
  padding: 0 50px;
  box-sizing: border-box;
}
.order-card {
  background: #2c2c2c;
  color: #ffffff;
  padding: 1.25rem;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.order-card h3 {
  color: #ffffff;
  margin: 0 0 12px 0;
}

.order-card .order-item p {
  color: #ffffff;
  margin: 0 0 6px;
}

.order-card .order-item p strong {
  color: #ffffff;
}

@media (max-width: 600px) {
  .orders-container { padding: 0 12px; }
  .order-item-poster { width: 70px; height: 70px; }
}

</style>

<style scoped>
.order-item-poster {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 6px;
  background: #f4f4f4;
  padding: 4px;
  display: inline-block;
}
</style>
