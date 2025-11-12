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
        <NuxtLink to="/about" class="header-button">
          Acerca
        </NuxtLink>
        <NuxtLink to="/contact" class="header-button">
          Contacto
        </NuxtLink>
      </div>

      <div class="header-icons-container">
        <v-btn icon link to="/ultimateLogin">
          <v-icon color="white">
            mdi-account-alert-outline
          </v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon color="white">
            mdi-magnify
          </v-icon>
        </v-btn>
        <v-btn icon>
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
import CartModal from '~/components/CartModal.vue'

export default {
  name: 'AppHeader',
  components: {
    CartModal
  },
  data () {
    return {
      showCart: false,
      drawer: false
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
