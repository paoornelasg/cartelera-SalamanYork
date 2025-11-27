<template>
  <v-app-bar color="white" app flat>
    <div class="main-header-container">
      <v-btn icon class="hamburger" @click="drawer = true">
        <v-icon color="white">
          mdi-menu
        </v-icon>
      </v-btn>

      <div class="logo-container">
        ㅤ
      </div>

      <div class="header-buttons-container">
        <NuxtLink to="/Home" class="header-button">
          Inicio
        </NuxtLink>
        <NuxtLink to="/shop" class="header-button">
          Cartelera
        </NuxtLink>
        <NuxtLink to="/aboutus" class="header-button">
          Acerca
        </NuxtLink>
        <NuxtLink to="/contact" class="header-button">
          Contacto
        </NuxtLink>
      </div>

      <div class="header-icons-container">
        <v-btn icon @click="openAccountModal">
          <v-icon color="white">
            mdi-account-alert-outline
          </v-icon>
        </v-btn>
        <SearchAutocomplete
          ref="searchAuto"
          v-model="searchQuery"
          @select="goToProduct"
          @search="onSearch"
        />
        <v-btn icon @click="onSearchFromButton">
          <v-icon color="white">
            mdi-magnify
          </v-icon>
        </v-btn>
        <v-btn icon @click="showFavorites = true">
          <v-icon color="white">
            mdi-heart-outline
          </v-icon>
        </v-btn>

        <v-btn icon @click="showCart = true">
          <v-icon color="white">
            mdi-cart-outline
          </v-icon>
        </v-btn>
      </div>
    </div>

    <CartModal :is-open="showCart" @update:isOpen="showCart = $event" />
    <FavoritesModal
      :is-open="showFavorites"
      @close="showFavorites = false"
    />

    <v-dialog
      v-model="showAccountModal"
      max-width="400"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          Mi cuenta
        </v-card-title>
        <v-card-text>
          <div v-if="isAuthenticated">
            <p class="mb-2">
              Has iniciado sesión como:
            </p>
            <p class="font-weight-medium">
              {{ userName }}
            </p>
            <p v-if="userEmail" class="text--secondary">
              {{ userEmail }}
            </p>
          </div>
          <div v-else>
            <p class="mb-4">
              Aún no has iniciado sesión.
            </p>
            <p class="text--secondary">
              Inicia sesión para administrar tu cuenta y tus compras.
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <template v-if="isAuthenticated">
            <v-btn text @click="closeAccountModal">
              Cerrar
            </v-btn>
            <v-btn color="red darken-1" text @click="logout">
              Cerrar sesión
            </v-btn>
          </template>
          <template v-else>
            <v-btn text @click="closeAccountModal">
              Cerrar
            </v-btn>
            <v-btn color="primary" text @click="goToLogin">
              Iniciar sesión
            </v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-navigation-drawer v-model="drawer" temporary app right>
      <v-list>
        <v-list-item link to="/Home">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/shop">
          <v-list-item-title>Shop</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/about">
          <v-list-item-title>About</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/contact">
          <v-list-item-title>Contact</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script>
import axios from 'axios'
import CartModal from '~/components/CartModal.vue'
import FavoritesModal from '~/components/FavoritesModal.vue' // Importar modal de favoritos
import SearchAutocomplete from '~/components/SearchAutocomplete.vue'

export default {
  name: 'AppHeader',
  components: {
    CartModal,
    FavoritesModal, // Componente modal de favoritos
    SearchAutocomplete
  },
  data () {
    return {
      showCart: false,
      showFavorites: false, // Variable para controlar el modal de favoritos
      drawer: false,
      showAccountModal: false,
      isClient: false,
      // valor del input enlazado con SearchAutocomplete
      searchQuery: ''
    }
  },
  computed: {
    isAuthenticated () {
      if (!this.isClient || typeof window === 'undefined') { return false }

      const token = window.localStorage.getItem('token')
      return !!token
    },
    userData () {
      if (!this.isClient || typeof window === 'undefined') { return null }

      const raw = window.localStorage.getItem('user')
      if (!raw) { return null }
      try {
        return JSON.parse(raw)
      } catch (e) {
        return null
      }
    },
    userName () {
      return this.userData?.usuario || this.userData?.name || ''
    },
    userEmail () {
      return this.userData?.email || ''
    }
  },
  mounted () {
    this.isClient = true
  },
  methods: {
    openAccountModal () {
      this.showAccountModal = true
    },
    async onSearch (q) {
      const query = (q || this.searchQuery || '').trim()
      if (!query) { return }
      try {
        // obtenemos coincidencias desde el backend
        const res = await axios.get('http://localhost:5020/api/movies', { params: {} })
        const items = res.data?.data ?? res.data ?? []
        const matches = (Array.isArray(items) ? items : []).filter((item) => {
          const title = (item.title || item.nombre || item.name || item.titulo || '').toString().toLowerCase()
          return title.includes(query.toLowerCase())
        })
        if (matches.length === 1) {
          const id = matches[0]._id || matches[0].id
          if (id) {
            this.$router.push({ path: `/product/${id}` })
            return
          }
        }
        this.$router.push({ path: '/shop', query: { q: query } })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error onSearch:', err.response?.data || err.message)
        this.$router.push({ path: '/shop', query: { q: query } })
      }
    },
    goToProduct (id) {
      if (!id) { return }
      this.searchQuery = ''
      this.$router.push({ path: `/product/${id}` })
    },
    onSearchFromButton () {
      const child = this.$refs.searchAuto
      if (child && typeof child.emitSearch === 'function') {
        child.emitSearch()
        return
      }
      this.onSearch()
    },
    closeAccountModal () {
      this.showAccountModal = false
    },
    goToLogin () {
      this.showAccountModal = false
      this.$router.push('/')
    },
    async logout () {
      try {
        let token = null
        if (typeof window !== 'undefined') {
          token = window.localStorage.getItem('token')
        }

        if (token) {
          await axios.post('http://localhost:5020/api/auth/logout', null, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        }

        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('user')
          window.localStorage.removeItem('rol')
        }

        this.showAccountModal = false
        // Redirigir a la página principal (index.vue) con el parámetro logout=true
        this.$router.push('/?logout=true')
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error al cerrar sesión:', err.response?.data || err.message)

        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('user')
          window.localStorage.removeItem('rol')
        }

        this.showAccountModal = false
        // Incluso si hay error, redirigir a index con logout=true
        this.$router.push('/?logout=true')
      }
    }
  }
}
</script>

<style scoped>
.v-app-bar {
  border-bottom: none !important;
  box-shadow: none !important;
}

.main-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: nowrap;
  padding: 0 16px;
  gap: 8px;
  height: 64px;
  overflow: hidden;
  background-color: #db133b;
}

.logo-container {
  flex: 1;
  text-align: center;
}

.header-buttons-container {
  flex: 2;
  justify-content: center;
  gap: 40px;
  align-items: center;
  display: flex;
}

.header-icons-container {
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
}

.header-button {
  color: black;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  color: white;
}

.header-button:hover {
  background-color: #f5f5f5;
}

.header-icons-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  width: 25%;
}

.header-icons-container .v-icon {
    font-size: 24px;
}

@media (max-width: 768px) {
  .main-header-container {
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 56px;
  }

  .hamburger {
    display: inline-flex !important;
    margin-right: 8px;
  }

  .header-icons-container {
    flex: 0 0 auto;
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: flex-end;
  }

  .logo-container {
    flex: 1;
    text-align: center;
    margin: 0 auto;
  }

  .header-buttons-container {
    display: none;
  }

  .header-icons-container .v-icon {
    font-size: 20px;
  }
}

.hamburger {
  display: none;
}
</style>
