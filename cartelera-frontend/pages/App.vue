<template>
  <div class="page-wrapper">
    <v-app class="main-header">
      <v-app-bar color="amber-lighten-5" dark>
        <div class="main-header-container">
          <div class="logo-container">
            Hi
          </div>

          <div class="header-buttons-container">
            <NuxtLink to="/Home" class="header-button">
              Home
            </NuxtLink>
            <NuxtLink to="/shop" class="header-button">
              Shop
            </NuxtLink>
            <NuxtLink to="/about" class="header-button active">
              About
            </NuxtLink>
            <NuxtLink to="/contact" class="header-button">
              Contact
            </NuxtLink>
          </div>

          <div class="header-icons-container">
            <v-btn icon>
              <v-icon>mdi-account-alert-outline</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-heart-outline</v-icon>
            </v-btn>

            <CartModal :isOpen="showCart" @update:isOpen="showCart = $event" />
            <v-btn icon @click="showCart = true">
              <v-icon>mdi-cart-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </v-app-bar>
    </v-app>

    <div class="main-section">
      Hi
    </div>

    <div class="secondary-section">
      Hi
    </div>

    <div class="top-picks-section">
      Hi
    </div>

    <div class="new-arrivals-section">
      Hi
    </div>

    <div class="blogs-section">
      Hi
    </div>
  </div>
</template>

<script>
import CartModal from '@/components/CartModal.vue'

export default {
  components: { CartModal },
  data () {
    return {
      showCart: false
    }
  }
}
</script>


<style scoped>

  .page-wrapper {
    display: contents;
  }

  .main-header {
    position: fixed;
  }

  .main-section {
    height: 100vh;
    width: 100vw;
    background-color: #fbebb5;
  }

  .secondary-section {
    height: 50vh;
    width: 100vw;
    background-color: #faf4f4;
  }

  .top-picks-section, .blogs-section {
    height: 70vh;
    width: 100wh;
    background-color: white;
  }

  .new-arrivals-section {
    height: 50vh;
    width: 100wh;
    background-color: #fff9e6;
  }

  .header-buttons-container {
    display: flex;
    height: 100%;
    gap: 50px;
    justify-content: center;
    align-items: center;
    /* border: 1px solid crimson; */
    width: 50%;
  }

  .header-icons-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /* border: 1px solid crimson; */
    height: 100%;
    width: 25%;
  }

  .header-button {
    color: black;
    cursor: pointer;
  }

  .main-header-container {
    display: flex;
    /* border: 1px solid crimson; */
    width: 100%;
    height: 100%;
    justify-content: space-evenly;
  }

  .logo-container {
    width: 25%;
    height: 100%;
    /* border: 1px solid crimson; */
  }

  ::v-deep(.container),
  ::v-deep(.container--fluid),
  ::v-deep(.v-container) {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    max-width: 100vw !important;
    width: 100% !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }
</style>
