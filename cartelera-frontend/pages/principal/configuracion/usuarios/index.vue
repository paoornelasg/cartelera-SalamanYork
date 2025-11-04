<template>
  <users-crud />
</template>

<script>
import usersCrud from '~/components/config/usersCRUD.vue'
export default {
  components: {
    usersCrud
  },
  layout: 'principal',
  middleware: 'auth'
}
</script>

<style scoped>
</style>
