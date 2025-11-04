<template>
  <products-crud/>    
</template>

<script>
import productsCrud from '~/components/config/productsCRUD.vue'
export default {
  layout: 'principal',
  middleware: 'auth',
  components: {
    productsCrud
  }
}
</script>

