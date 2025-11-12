<template>
  <v-app>
    <AppHeader />

    <v-main>
      <v-carousel
        height="450"
        show-arrows-on-hover
        cycle
        hide-delimiter-background
        delimiter-icon="mdi-minus"
        class="billboard-carousel"
      >
        <v-carousel-item
          v-for="movie in movies"
          :key="movie.id"
          class="carousel-item-container"
        >
          <v-img
            :src="movie.image"
            height="100%"
            cover
            class="carousel-background-image"
          />

          <div class="carousel-content-wrapper d-flex flex-column justify-center align-center fill-height">
            <v-container>
              <v-row align="center" justify="center">
                <v-col cols="12" md="3" class="d-flex justify-center justify-md-end">
                  <v-img
                    :src="movie.image"
                    max-height="280"
                    max-width="180"
                    contain
                    class="elevation-6 rounded"
                  />
                </v-col>

                <v-col cols="12" md="6" class="text-white text-center text-md-left">
                  <div class="text-h3 font-weight-bold mb-2 white-text-no-shadow">
                    {{ movie.title }}
                  </div>
                  <div class="text-h6 font-weight-light mb-4 white-text-no-shadow">
                    {{ movie.duration }}
                  </div>
                  <v-btn
                    color="yellow"
                    class="text-black mb-2"
                    size="large"
                    elevation="2"
                    @click.stop="goToMovieDetails(movie.id)"
                  >
                    Comprar entradas
                  </v-btn>
                  <div class="d-flex align-center justify-center justify-md-start text-subtitle-1 white-text-no-shadow">
                    <NuxtLink to="/home" class="router-link-white">
                      <span class="font-weight-medium">Home</span>
                    </NuxtLink>
                    <span class="ml-2">
                      <v-icon size="small" color="white">mdi-chevron-right</v-icon> <span>Cartelera</span>
                    </span>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-carousel-item>
      </v-carousel>
      <v-container class="top-filters-bar" fluid>
        <v-row
          class="align-center justify-space-between top-filters-bar"
          style="max-width: 1400px; margin: auto;"
        >
          <v-col
            cols="12"
            md="6"
            class="d-flex align-center gap-4 flex-wrap justify-start justify-md-start"
          >
            <div
              class="d-flex align-center filters-label"
              style="cursor: pointer;"
              @click="drawerFilters = !drawerFilters"
            >
              <v-icon class="mr-1 filters-icon">
                mdi-tune
              </v-icon>
              <span class="filters-text">Filtrar</span>
            </div>

            <v-icon>mdi-view-grid</v-icon>

            <span class="filters-text font-weight-medium hidden-sm-and-down">
              Mostrando {{ shownCount }}–{{ Math.min(shownCount + paginatedMovies.length - 1, totalMovies) }} de {{ totalMovies }} resultados
            </span>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="d-flex align-center justify-start justify-md-end gap-4 flex-wrap"
          >
            <div class="d-flex align-center gap-2">
              <span class="filters-text font-weight-medium">Mostrarㅤ</span>
              <v-text-field
                v-model.number="itemsPerPage"
                type="number"
                min="1"
                max="50"
                hide-details
                solo
                class="input-flat"
                style="max-width: 70px; font-size: 14px;"
              />
            </div>

            <div class="d-flex align-center gap-2">
              <span class="filters-text font-weight-medium">Ordenar porㅤ</span>
              <v-select
                v-model="sortOption"
                :items="sortItems"
                solo
                hide-details
                class="input-flat"
                style="max-width: 180px; font-size: 14px;"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="drawerFilters" max-width="400px">
        <v-card>
          <v-card-title class="headline">
            Filtrar por
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="searchQuery"
              label="Buscar película..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              class="mb-3"
            />
            <v-select
              v-model="genre"
              label="Género"
              :items="genreItems"
              variant="outlined"
              density="compact"
              class="mb-3"
            />
            <v-select
              v-model="language"
              label="Idioma"
              :items="languageItems"
              variant="outlined"
              density="compact"
              class="mb-3"
            />
            <v-select
              v-model="format"
              label="Formato"
              :items="formatItems"
              variant="outlined"
              density="compact"
              class="mb-3"
            />
            <v-text-field
              v-model="date"
              label="Fecha"
              type="date"
              variant="outlined"
              density="compact"
            />
          </v-card-text>

          <v-card-actions class="d-flex justify-center pa-4 pt-0">
            <v-btn
              text
              color="black"
              variant="outlined"
              class="mr-4"
              @click="clearFilters"
            >
              Limpiar
            </v-btn>
            <v-btn
              color="#d4a02b"
              dark
              flat
              @click="applyFilters"
            >
              Aplicar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-container class="products-container">
        <v-row justify="center" align="stretch" class="product-grid">
          <v-col
            v-for="movie in paginatedMovies"
            :key="movie.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="product-card elevation-0" @click="goToMovieDetails(movie.id)">
              <v-img
                :src="movie.image"
                height="400"
                cover
                class="product-image"
              />

              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-2">
                  <v-chip
                    color="yellow"
                    label
                    small
                    class="font-weight-bold text-black"
                  >
                    {{ movie.classification }}
                  </v-chip>
                  <span class="text-body-2 text-grey-darken-1 ml-2">
                    {{ movie.duration }}
                  </span>
                </div>

                <div class="product-title text-h6 mb-1">
                  {{ movie.title }}
                </div>

                <div class="text-body-2 text-grey-darken-2">
                  {{ movie.genre }}
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn class="add-to-cart-btn" text @click.stop="goToMovieDetails(movie.id)">
                  <v-icon left color="#d4a02b">
                    mdi-ticket
                  </v-icon>
                  <span style="color: #d4a02b;">Ver Detalles / Entradas</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <div class="text-center mt-8">
          <v-pagination v-model="page" :length="totalPages" square color="#d4a02b" @input="changePage" />
        </div>
      </v-container>

      <RoseSection />
      <PageFooter />
    </v-main>
  </v-app>
</template>

<script>
// import axios from 'axios'
import PageFooter from '~/components/PageFooter.vue'
// import ProductImage from '~/components/ProductImage.vue'
import RoseSection from '~/components/RoseSection.vue'
import AppHeader from '~/components/PageHeader.vue'

export default {
  components: {
    PageFooter,
    // ProductImage,
    RoseSection,
    AppHeader
  },
  data () {
    return {
      movies: [
        { id: 1, title: 'Tron: Ares', genre: 'Ciencia Ficción, Acción', duration: '2h 17min', image: 'https://statics.cinemex.com/movie_posters/4I2SJBNiirJV6Hi-360x540.jpg', releaseDate: '2025-10-10', language: 'Inglés', format: 'Premium', classification: 'A' },
        { id: 2, title: 'El Teléfono Negro 2', genre: 'Terror, Suspenso', duration: '1h 54min', image: 'https://statics.cinemex.com/movie_posters/ptdF3hn934zNJD3-360x540.jpg', releaseDate: '2025-10-17', language: 'Inglés', format: 'Tradicional', classification: 'B-15' },
        { id: 3, title: 'Chainsaw Man La Película: Arco de Reze', genre: 'Animación, Acción, Fantasía', duration: '1h 40min', image: 'https://statics.cinemex.com/movie_posters/UjGW90lTGlcnDEz-360x540.jpg', releaseDate: '2025-10-24', language: 'Japonés', format: '3D', classification: 'B-15' },
        { id: 4, title: 'Cacería De Brujas', genre: 'Terror, Suspenso', duration: '2h 19min', image: 'https://statics.cinemex.com/movie_posters/czV5cp4B5CgKL0I-360x540.jpg', releaseDate: '2025-10-31', language: 'Inglés', format: 'Tradicional', classification: 'B-15' },
        { id: 5, title: 'A Pesar De Ti', genre: 'Comedia, Romance', duration: '2h 0min', image: 'https://statics.cinemex.com/movie_posters/njJOQEPIaJ0iJ7o-360x540.jpg', releaseDate: '2025-10-17', language: 'Español', format: 'Tradicional', classification: 'B' },
        { id: 6, title: 'Springsteen: Música De Ninguna Parte', genre: 'Documental, Música', duration: '2h 0min', image: 'https://statics.cinemex.com/movie_posters/1w5od7S4ry9dZP2-360x540.jpg', releaseDate: '2025-11-01', language: 'Inglés', format: 'Tradicional', classification: 'B' },
        { id: 7, title: 'Good Boy: Confía En Su Instinto', genre: 'Terror, Suspenso', duration: '1h 12min', image: 'https://statics.cinemex.com/movie_posters/EUrNvNXmw8rUAhi-360x540.jpg', releaseDate: '2025-10-24', language: 'Inglés', format: 'Premium', classification: 'B' },
        { id: 8, title: 'Amor Fuera de Tiempo', genre: 'Romance, Drama, Fantasía', duration: '1h 39min', image: 'https://tickets-static-content.cinepolis.com/pimcore/9618/assets/Mexico/Tickets/Movies/AmorFueraDeTiempo/Es/Poster_720x1022_copia_2_/resource.jpg', releaseDate: '2025-10-10', language: 'Inglés', format: 'Tradicional', classification: 'B' },
        { id: 9, title: 'Cuando El Cielo Se Equivoca', genre: 'Comedia, Drama', duration: '1h 38min', image: 'https://statics.cinemex.com/movie_posters/SMuqdJXLQnRahiI-360x540.jpg', releaseDate: '2025-10-31', language: 'Español', format: 'Tradicional', classification: 'B' },
        { id: 10, title: 'The Craft (Jóvenes Brujas)', genre: 'Terror, Fantasía, Drama', duration: '1h 50min', image: 'https://statics.cinemex.com/movie_posters/2TlcLmfOGvBEMw8-360x540.jpg', releaseDate: '1996-10-31', language: 'Inglés', format: '3D', classification: 'B-15' },
        { id: 11, title: 'No Me Sigas', genre: 'Terror, Suspenso', duration: '1h 29min', image: 'https://statics.cinemex.com/movie_posters/p6DTADwW29raQN7-360x540.jpg', releaseDate: '2025-11-07', language: 'Español', format: 'Tradicional', classification: 'B-15' },
        { id: 12, title: '6 Exorcismos', genre: 'Terror', duration: '1h 44min', image: 'https://statics.cinemex.com/movie_posters/jSom2HZDQ30awWZ-360x540.jpg', releaseDate: '2025-10-17', language: 'Español', format: 'Tradicional', classification: 'B-15' }
      ],

      genre: 'Todos',
      language: 'Todos',
      format: 'Todos',
      date: null,
      searchQuery: '',

      page: 1,
      itemsPerPage: 12,
      drawerFilters: false,
      sortOption: 'Default',
      sortItems: ['Default', 'Título (A-Z)', 'Título (Z-A)', 'Fecha (más reciente)', 'Fecha (más antigua)']
    }
  },

  computed: {
    genreItems () {
      const genres = new Set(['Todos'])
      this.movies.forEach((movie) => {
        movie.genre.split(',').map(g => g.trim()).forEach(g => genres.add(g))
      })
      return Array.from(genres).sort()
    },
    languageItems () {
      const languages = new Set(['Todos'])
      this.movies.forEach(movie => languages.add(movie.language))
      return Array.from(languages).sort()
    },
    formatItems () {
      const formats = new Set(['Todos'])
      this.movies.forEach(movie => formats.add(movie.format))
      return Array.from(formats).sort()
    },

    filteredMovies () {
      let filtered = [...this.movies]

      if (this.genre !== 'Todos') {
        filtered = filtered.filter(movie => movie.genre.includes(this.genre))
      }
      if (this.language !== 'Todos') {
        filtered = filtered.filter(movie => movie.language === this.language)
      }
      if (this.format !== 'Todos') {
        filtered = filtered.filter(movie => movie.format === this.format)
      }
      if (this.date) {
        filtered = filtered.filter(movie => movie.releaseDate === this.date)
      }
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.trim().toLowerCase()
        filtered = filtered.filter(movie => movie.title.toLowerCase().includes(query))
      }

      if (this.sortOption === 'Título (A-Z)') {
        filtered.sort((a, b) => a.title.localeCompare(b.title))
      } else if (this.sortOption === 'Título (Z-A)') {
        filtered.sort((a, b) => b.title.localeCompare(a.title))
      } else if (this.sortOption === 'Fecha (más reciente)') {
        filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      } else if (this.sortOption === 'Fecha (más antigua)') {
        filtered.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate))
      }

      return filtered
    },

    paginatedMovies () {
      const start = (this.page - 1) * this.itemsPerPage
      return this.filteredMovies.slice(start, start + this.itemsPerPage)
    },

    shownCount () {
      return this.filteredMovies.length === 0 ? 0 : (this.page - 1) * this.itemsPerPage + 1
    },

    totalMovies () {
      return this.filteredMovies.length
    },

    totalPages () {
      return Math.ceil(this.filteredMovies.length / this.itemsPerPage)
    }
  },

  mounted () {
  },

  methods: {
    changePage (page) {
      this.page = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    isActive (route) {
      return this.$route.path === route
    },

    applyFilters () {
      this.drawerFilters = false
      this.page = 1
    },

    clearFilters () {
      this.genre = 'Todos'
      this.language = 'Todos'
      this.format = 'Todos'
      this.date = null
      this.searchQuery = ''
      this.page = 1
      this.drawerFilters = false
    },

    goToMovieDetails (id) {
      this.$router.push(`/product/${id}`)
    },

    showAlert (message, type) {
      this.$store.dispatch('alert/triggerAlert', { message, type })
    }
  }
}
</script>

<style scoped>
/* Estilos nuevos */
.carousel-item-container {
  position: relative;
}

.carousel-background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.carousel-content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  background: rgba(0, 0, 0, 0.4);
}

.white-text-no-shadow {
  color: white;
  text-shadow: none;
}

.router-link-white {
  color: white;
  text-decoration: none;
  font-weight: 500;
}
.router-link-white:hover {
  text-decoration: underline;
}
/* Fin de nuevos estilos */

.main-header-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
}

.logo-container {
  width: 25%;
  height: 100%;
}

.header-buttons-container {
  display: flex;
  height: 100%;
  gap: 50px;
  justify-content: center;
  align-items: center;
  width: 50%;
}

.header-icons-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  width: 25%;
}

.header-button {
  color: white;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}

.shop-hero {
  background-color: #fbebb5;
  padding: 100px 0;
  text-align: center;
}

.shop-hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2c3e50;
}

.shop-hero p {
  font-size: 1.2rem;
  color: #666;
}

.products-container {
  padding: 0 10px 50px;
}

.product-grid {
  max-width: 1400px;
  margin: 0 auto;
}

.product-card {
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  max-width: 280px;
  width: 100%;
  height: auto;
  margin: auto;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.product-image {
  object-fit: cover;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  padding-top: 0;
}

.products-summary {
  font-size: 0.9rem;
  color: #555;
  margin: 10px 0 20px;
}

.product-card {
  border-radius: 10px;
  box-shadow: none;
  transition: 0.2s ease-in-out;
  border: 1px solid transparent;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: none;
}

.top-filters-bar {
  background-color: #fef2f2;
  padding: 0 8px;
  margin: 12px auto 20px auto;
  border-radius: 0 0 8px 8px;
}

.input-flat.v-input--solo.v-input {
  max-width: 60px;
  font-size: 14px;
}

.input-flat .v-input__control {
  min-height: 32px;
  padding: 0 4px;
}

.input-flat.v-select {
  max-width: 120px;
  font-size: 14px;
}

.gap-4 {
  gap: 1rem;
}

.items-per-page-input input {
  text-align: center;
  font-size: 0.85rem;
  padding: 0 6px;
}

.filters-label {
  font-weight: 500;
  font-size: 16px;
  user-select: none;
  display: flex;
  align-items: center;
}

.filters-label .v-icon {
  font-size: 22px;
}

.filters-text {
  font-size: 16px;
  margin-left: 6px;
}

.input-align {
  margin-top: 2px;
}

.add-to-cart-btn {
  text-transform: uppercase;
  font-weight: 500;
  transition: 0.2s ease;
}
.add-to-cart-btn:hover {
  background-color: rgba(166, 124, 0, 0.05);
}

@media (max-width: 960px) {
  .shop-hero {
    padding: 80px 0;
  }

  .shop-hero h1 {
    font-size: 2.5rem;
  }

  .header-buttons-container {
    gap: 30px;
  }
}

@media (max-width: 600px) {
  .shop-hero h1 {
    font-size: 2rem;
  }

  .header-buttons-container {
    gap: 15px;
  }

  .header-button {
    font-size: 0.9rem;
  }

  .logo-link {
    font-size: 1.2rem;
  }
}
</style>
