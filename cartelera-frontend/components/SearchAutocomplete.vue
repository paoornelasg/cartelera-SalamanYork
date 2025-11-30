<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y max-width="360">
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="localQuery"
        placeholder="  Título de la película"
        dense
        hide-details
        single-line
        clearable
        v-bind="attrs"
        class="search-input"
        @keyup.enter="emitSearch"
        v-on="on"
      />
    </template>

    <v-list>
      <v-list-item v-if="loading">
        <v-list-item-title>Cargando...</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-for="item in results"
        :key="item._id || item.id"
        @click="selectItem(item)"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ item.title || item.nombre || item.name || item.titulo }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="item.year">
            {{ item.year }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="!results.length && !loading">
        <v-list-item-title class="text--disabled">
          No hay resultados
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SearchAutocomplete',
  props: {
    value: { type: String, default: '' },
    modelValue: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'input', 'select', 'search'],
  data () {
    return {
      localQuery: this.modelValue || this.value || '',
      results: [],
      loading: false,
      menu: false,
      debounceTimer: null,
      cachedMovies: null
    }
  },
  watch: {
    modelValue (v) { this.localQuery = v },
    value (v) { if (!this.modelValue) { this.localQuery = v } },
    localQuery (val) {
      this.$emit('update:modelValue', val)
      this.$emit('input', val)
      const q = (val || '').trim()
      if (!q) {
        this.results = []
        this.menu = false
        if (this.debounceTimer) { clearTimeout(this.debounceTimer); this.debounceTimer = null }
        return
      }
      this.debounceFetch()
    }
  },
  beforeDestroy () {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
  },
  methods: {
    emitSearch () {
      const q = (this.localQuery || '').trim()
      if (!q) { return }
      this.$emit('search', q)
      this.menu = false
    },
    selectItem (item) {
      const id = item._id || item.id
      if (!id) { return }
      this.$emit('select', id)
      this.$emit('update:modelValue', '')
      this.$emit('input', '')
      this.localQuery = ''
      this.results = []
      this.menu = false
    },
    debounceFetch () {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      this.debounceTimer = setTimeout(() => { this.fetchSuggestions() }, 300)
    },
    async fetchSuggestions () {
      const q = (this.localQuery || '').trim()
      if (!q) { this.results = []; this.menu = false; return }
      this.loading = true
      try {
        let items = []
        if (this.cachedMovies) {
          items = this.cachedMovies
        } else {
          // Obtengo todas las películas
          const res = await axios.get('http://localhost:5020/api/movies')
          items = res.data?.data ?? res.data ?? []
          this.cachedMovies = Array.isArray(items) ? items : []
        }

        const qLower = q.toLowerCase()
        this.results = (Array.isArray(items) ? items : []).filter((item) => {
          const title = (item.title || item.nombre || item.name || item.titulo || '').toString().toLowerCase()
          return title.includes(qLower)
        }).slice(0, 10)
      } catch (e) {
        this.results = []
      } finally {
        this.loading = false
        this.menu = this.results.length > 0
      }
    }
  }
}
</script>

<style scoped>
.search-input {
  max-width: 260px;
  min-width: 160px;
  margin-right: 8px;
  background-color: white;
  border-radius: 6px;
}
</style>
