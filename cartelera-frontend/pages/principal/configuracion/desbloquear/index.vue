<template>
  <unlock-users />
</template>

<script>
import UnlockUsers from '~/components/config/unlockUsers.vue'
export default {
  components: {
    UnlockUsers
  },
  layout: 'principal',
  middleware: 'auth'
}
</script>

<style scoped>

</style>
