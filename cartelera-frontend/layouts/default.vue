<template>
  <v-app>
    <v-alert
      v-if="$store.state.alert.visible"
      :type="$store.state.alert.type"
      dismissible
      top
      right
      class="position-fixed"
    >
      {{ $store.state.alert.message }}
    </v-alert>

    <v-container class="layout-wrapper">
      <nuxt />
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      //
    }
  }
}
</script>

<style scoped>
.position-fixed {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
}

.layout-wrapper {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>

<style>
html, body, #__nuxt, #__layout, .v-application, .v-main {
  margin: 0;
  padding: 0;
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
  background-color: white;
}

.container {
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  max-width: 100vw !important;
  width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
}

.v-application,
.v-application--wrap,
.v-main {
  margin: 0 !important;
  padding: 0 !important;
}

.v-toolbar__content {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.v-carousel {
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
}

.v-carousel .v-window__container {
  width: 100vw !important;
  max-width: 100vw !important;
  padding: 0 !important;
  margin: 0 !important;
}

.v-carousel__item {
  width: 100vw !important;
}

</style>
