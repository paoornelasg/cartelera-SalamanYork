<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height d-flex align-center justify-center">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {}
</script>

<style scoped>
.fill-height {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background-color: #0F4C75;
  overflow: hidden;
}
</style>
