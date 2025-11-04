<template>
  <div class="reports-container">
    <v-card class="mb-6" flat>
      <v-card-title class="text-h4 font-weight-bold">
        Reports Dashboard
        <v-spacer />
        <v-menu
          offset-y
          left
        >
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              class="ml-2"
              v-on="on"
            >
              <v-icon left>
                mdi-file-export-outline
              </v-icon>
              Export
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item @click="exportData('pdf')">
              <v-list-item-icon>
                <v-icon>mdi-file-pdf-box</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Export as PDF</v-list-item-title>
            </v-list-item>
            <v-list-item @click="exportData('excel')">
              <v-list-item-icon>
                <v-icon>mdi-file-excel</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Export as Excel</v-list-item-title>
            </v-list-item>
            <v-list-item @click="exportData('csv')">
              <v-list-item-icon>
                <v-icon>mdi-file-delimited</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Export as CSV</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card outlined class="mb-4">
              <v-card-title class="subtitle-1">
                Filters
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="3">
                    <v-menu
                      ref="startDateMenu"
                      v-model="startDateMenu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateRange.start"
                          label="Start Date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="dateRange.start"
                        no-title
                        @input="startDateMenu = false"
                      />
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-menu
                      ref="endDateMenu"
                      v-model="endDateMenu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateRange.end"
                          label="End Date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="dateRange.end"
                        no-title
                        @input="endDateMenu = false"
                      />
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select
                      v-model="selectedCategory"
                      :items="categories"
                      label="Category"
                      outlined
                      dense
                    />
                  </v-col>
                  <v-col cols="12" sm="3" class="d-flex align-center">
                    <v-btn color="primary" class="mr-2" @click="applyFilters">
                      <v-icon left>
                        mdi-filter
                      </v-icon>
                      Apply Filters
                    </v-btn>
                    <v-btn text @click="resetFilters">
                      <v-icon left>
                        mdi-refresh
                      </v-icon>
                      Reset
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Stats cards -->
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card class="mx-auto" color="#E3F2FD" elevation="4">
              <v-card-text>
                <div class="text-overline mb-2">
                  TOTAL SALES
                </div>
                <div class="text-h4 mb-2">
                  ${{ totalSales.toLocaleString() }}
                </div>
                <v-icon
                  :color="salesTrend > 0 ? 'success' : 'error'"
                  class="mr-1"
                >
                  {{ salesTrend > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
                <span :class="salesTrend > 0 ? 'success--text' : 'error--text'">
                  {{ Math.abs(salesTrend) }}% since last month
                </span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="mx-auto" color="#FFF3E0" elevation="4">
              <v-card-text>
                <div class="text-overline mb-2">
                  ORDERS
                </div>
                <div class="text-h4 mb-2">
                  {{ totalOrders }}
                </div>
                <v-icon
                  :color="ordersTrend > 0 ? 'success' : 'error'"
                  class="mr-1"
                >
                  {{ ordersTrend > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
                <span :class="ordersTrend > 0 ? 'success--text' : 'error--text'">
                  {{ Math.abs(ordersTrend) }}% since last month
                </span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="mx-auto" color="#E8F5E9" elevation="4">
              <v-card-text>
                <div class="text-overline mb-2">
                  CUSTOMERS
                </div>
                <div class="text-h4 mb-2">
                  {{ totalCustomers }}
                </div>
                <v-icon
                  :color="customersTrend > 0 ? 'success' : 'error'"
                  class="mr-1"
                >
                  {{ customersTrend > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
                <span :class="customersTrend > 0 ? 'success--text' : 'error--text'">
                  {{ Math.abs(customersTrend) }}% since last month
                </span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="mx-auto" color="#FFEBEE" elevation="4">
              <v-card-text>
                <div class="text-overline mb-2">
                  AVERAGE ORDER VALUE
                </div>
                <div class="text-h4 mb-2">
                  ${{ averageOrderValue }}
                </div>
                <v-icon
                  :color="aovTrend > 0 ? 'success' : 'error'"
                  class="mr-1"
                >
                  {{ aovTrend > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
                <span :class="aovTrend > 0 ? 'success--text' : 'error--text'">
                  {{ Math.abs(aovTrend) }}% since last month
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Charts Row -->
        <v-row class="mt-6">
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title>
                Sales Performance
                <v-spacer />
                <v-btn-toggle
                  v-model="salesChartType"
                  mandatory
                  dense
                >
                  <v-btn small value="daily">
                    Daily
                  </v-btn>
                  <v-btn small value="weekly">
                    Weekly
                  </v-btn>
                  <v-btn small value="monthly">
                    Monthly
                  </v-btn>
                </v-btn-toggle>
              </v-card-title>
              <v-card-text>
                <v-sheet height="300">
                  <!-- Chart component would go here -->
                  <div class="chart-placeholder d-flex align-center justify-center">
                    <v-icon size="80" color="grey lighten-1">
                      mdi-chart-line
                    </v-icon>
                  </div>
                </v-sheet>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Sales by Category</v-card-title>
              <v-card-text>
                <v-sheet height="300">
                  <!-- Pie chart component would go here -->
                  <div class="chart-placeholder d-flex align-center justify-center">
                    <v-icon size="80" color="grey lighten-1">
                      mdi-chart-pie
                    </v-icon>
                  </div>
                </v-sheet>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Data Table -->
        <v-row class="mt-6">
          <v-col cols="12">
            <v-card>
              <v-card-title>
                Recent Orders
                <v-spacer />
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  dense
                />
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="orders"
                :search="search"
                :items-per-page="10"
                :footer-props="{
                  'items-per-page-options': [5, 10, 15, 20],
                  'show-current-page': true,
                  'show-first-last-page': true
                }"
                class="elevation-1"
              >
                <template #[`item.status`]="{ item }">
                  <v-chip
                    :color="getStatusColor(item.status)"
                    dark
                    small
                  >
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-icon small class="mr-2" @click="viewOrderDetails(item)">
                    mdi-eye
                  </v-icon>
                  <v-icon small @click="downloadInvoice(item)">
                    mdi-download
                  </v-icon>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Order Details Dialog -->
    <v-dialog v-model="orderDialog" max-width="800px">
      <v-card>
        <v-card-title class="headline">
          Order Details
          <v-spacer />
          <v-btn icon @click="orderDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="selectedOrder">
          <v-row>
            <v-col cols="6">
              <strong>Order ID:</strong> {{ selectedOrder.id }}
            </v-col>
            <v-col cols="6">
              <strong>Date:</strong> {{ selectedOrder.date }}
            </v-col>
            <v-col cols="6">
              <strong>Customer:</strong> {{ selectedOrder.customer }}
            </v-col>
            <v-col cols="6">
              <strong>Status:</strong>
              <v-chip
                :color="getStatusColor(selectedOrder.status)"
                dark
                small
              >
                {{ selectedOrder.status }}
              </v-chip>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <h3 class="mb-3">
            Order Items
          </h3>
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in selectedOrder.items" :key="i">
                  <td>{{ item.product }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ item.price.toFixed(2) }}</td>
                  <td>${{ (item.quantity * item.price).toFixed(2) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-row class="mt-4">
            <v-col cols="12" class="text-right">
              <h4>Subtotal: ${{ selectedOrder.subtotal.toFixed(2) }}</h4>
              <p>Tax ({{ selectedOrder.taxRate }}%): ${{ selectedOrder.tax.toFixed(2) }}</p>
              <h3>Total: ${{ selectedOrder.total.toFixed(2) }}</h3>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="downloadInvoice(selectedOrder)">
            <v-icon left>
              mdi-download
            </v-icon>
            Download Invoice
          </v-btn>
          <v-btn color="secondary" text @click="orderDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  layout: 'principal',
  middleware: 'auth',
  data () {
    return {
      // Date filters
      dateRange: {
        start: new Date().toISOString().substr(0, 10),
        end: new Date().toISOString().substr(0, 10)
      },
      startDateMenu: false,
      endDateMenu: false,

      // Category filter
      selectedCategory: 'All',
      categories: ['All', 'Electronics', 'Clothing', 'Food & Beverages', 'Home & Garden'],

      // Chart controls
      salesChartType: 'monthly',

      // Stats data
      totalSales: 154892,
      salesTrend: 12.5,
      totalOrders: 1245,
      ordersTrend: 8.2,
      totalCustomers: 876,
      customersTrend: 5.7,
      averageOrderValue: 124,
      aovTrend: -2.3,

      // Table data
      search: '',
      headers: [
        { text: 'Order ID', value: 'id' },
        { text: 'Date', value: 'date' },
        { text: 'Customer', value: 'customer' },
        { text: 'Amount', value: 'total' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      orders: [
        {
          id: 'ORD-2023-0001',
          date: '2023-04-01',
          customer: 'John Smith',
          total: 245.99,
          status: 'Completed',
          items: [
            { product: 'Laptop', quantity: 1, price: 220.00 },
            { product: 'Mouse', quantity: 1, price: 25.99 }
          ],
          subtotal: 245.99,
          taxRate: 10,
          tax: 24.60
        },
        {
          id: 'ORD-2023-0002',
          date: '2023-04-01',
          customer: 'Sarah Johnson',
          status: 'Processing',
          items: [
            { product: 'T-shirt', quantity: 2, price: 29.99 },
            { product: 'Jeans', quantity: 1, price: 29.97 }
          ],
          subtotal: 89.95,
          taxRate: 10,
          tax: 9.00,
          total: 98.95
        },
        {
          id: 'ORD-2023-0003',
          date: '2023-04-02',
          customer: 'Mike Wilson',
          status: 'Shipped',
          items: [
            { product: 'Headphones', quantity: 1, price: 132.50 }
          ],
          subtotal: 132.50,
          taxRate: 10,
          tax: 13.25,
          total: 145.75
        },
        {
          id: 'ORD-2023-0004',
          date: '2023-04-02',
          customer: 'Emma Davis',
          status: 'Completed',
          items: [
            { product: 'Book', quantity: 3, price: 18.25 }
          ],
          subtotal: 54.75,
          taxRate: 10,
          tax: 5.48,
          total: 60.23
        },
        {
          id: 'ORD-2023-0005',
          date: '2023-04-03',
          customer: 'Tom Brown',
          status: 'Cancelled',
          items: [
            { product: 'Smartphone', quantity: 1, price: 399.99 },
            { product: 'Screen Protector', quantity: 1, price: 14.95 },
            { product: 'Phone Case', quantity: 1, price: 23.96 }
          ],
          subtotal: 438.90,
          taxRate: 10,
          tax: 43.89,
          total: 482.79
        }
      ],

      // Dialog controls
      orderDialog: false,
      selectedOrder: null
    }
  },
  methods: {
    applyFilters () {
      // Logic to apply filters would go here
      this.$store.dispatch('alert/triggerAlert', {
        message: 'Filters applied successfully',
        type: 'success'
      })
    },
    resetFilters () {
      this.dateRange = {
        start: new Date().toISOString().substr(0, 10),
        end: new Date().toISOString().substr(0, 10)
      }
      this.selectedCategory = 'All'

      this.$store.dispatch('alert/triggerAlert', {
        message: 'Filters have been reset',
        type: 'info'
      })
    },
    exportData (format) {
      // Logic to export data would go here
      this.$store.dispatch('alert/triggerAlert', {
        message: `Report exported as ${format.toUpperCase()} successfully`,
        type: 'success'
      })
    },
    getStatusColor (status) {
      switch (status) {
        case 'Completed':
          return 'success'
        case 'Processing':
          return 'primary'
        case 'Shipped':
          return 'info'
        case 'Cancelled':
          return 'error'
        default:
          return 'grey'
      }
    },
    viewOrderDetails (order) {
      this.selectedOrder = order
      this.orderDialog = true
    },
    downloadInvoice (order) {
      // Logic to download invoice would go here
      this.$store.dispatch('alert/triggerAlert', {
        message: `Invoice for order ${order.id} downloaded`,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.reports-container {
  min-height: calc(100vh - 64px);
}
.chart-placeholder {
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
