<template>
  <v-app>
    <v-navigation-drawer app permanent color="#f5f5f5">
      <v-list dense>
        <v-list-item-group>
          <v-list-item 
            v-for="(item, i) in opcionesPrincipales" 
            :key="i"
            v-if="canAccess(item.roles)"
            @click="goTo(item.path)"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-divider class="my-2" />

        <v-list-item
          v-for="(item, i) in opcionesFinales"
          :key="i"
          v-if="canAccess(item.roles)"
          @click="goTo(item.path)"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#1976D2" dark>
      <v-toolbar-title>Ecommerce Dashboard</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-alert
          v-if="$store.state.alert.visible"
          :type="$store.state.alert.type"
          dismissible
          class="position-fixed"
        >
          {{ $store.state.alert.message }}
        </v-alert>

        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      opcionesPrincipales: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', path: '/principal', roles: ['admin', 'usuario'] },
        { title: 'Products', icon: 'mdi-cube-outline', path: '/principal/inventory', roles: ['admin'] },
        { title: 'Orders', icon: 'mdi-cart-outline', path: '/principal/orders', roles: ['admin'] },
        { title: 'Reports', icon: 'mdi-chart-bar', path: '/principal/reports', roles: ['admin'] }
      ],
      opcionesFinales: [
        { title: 'Settings', icon: 'mdi-cog', path: '/principal/settings', roles: ['admin'] },
        { title: 'Log Out', icon: 'mdi-logout', path: '/', roles: ['admin', 'usuario'] }
      ]
    }
  },
  methods: {
    canAccess (roles) {
      return this.$auth?.user && roles.includes(this.$auth.user.rol)
    },
    goTo (ruta) {
      if (ruta === '/') {
        this.logout()
      } else {
        this.$router.push(ruta)
      }
    },
    async logout () {
      try {
        await this.$axios.post('/users/logout')
        window.location.href = '/'
      } catch (err) {
        this.$store.dispatch('alert/triggerAlert', {
          message: 'Error al cerrar sesión.',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
.position-fixed {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}
</style>