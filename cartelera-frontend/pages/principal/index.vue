<template>
  <v-container class="margin-initial" fluid>
    <h1 class="main-dashboard-title">
      Business Dashboard
    </h1>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-btn class="custom-button" block color="secondary" height="100">
          Today's Orders
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn class="custom-button" block color="secondary" height="100">
          Total Orders
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn class="custom-button" block color="secondary" height="100">
          Number of Clients
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn class="custom-button" block color="secondary" height="100">
          Number of Suppliers
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'principal'
}
</script>

<style scoped>

.margin-initial {
  margin: initial;
}

.main-dashboard-title {
  color: #050A30;
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.custom-button {
  border-radius: 20px;
  height: 100px;

}
</style>
