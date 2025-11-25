<template>
  <div v-if="isOpen" class="cart-overlay">
    <div class="cart-modal-container">
      <div class="cart-header">
        <div class="cart-header-bar">
          <h3 class="cart-title">
            Mis Favoritos
          </h3>
          <v-icon class="close-icon" @click="$emit('close')">
            mdi-close
          </v-icon>
        </div>
      </div>

      <div class="cart-body">
        <div v-if="loading" class="text-center py-5">
          <v-progress-circular indeterminate color="#db133b" />
        </div>

        <div v-else-if="favoritesList.length === 0" class="empty-cart-message">
          No tienes películas en favoritos
        </div>

        <div v-else>
          <div
            v-for="movie in favoritesList"
            :key="movie.id"
            class="cart-item"
            style="cursor: pointer;"
            @click="goToMovie(movie.id)"
          >
            <img
              :src="movie.image"
              class="cart-item-image"
              alt="Póster"
            >
            <div class="cart-item-details">
              <p class="cart-item-name">
                {{ movie.title }}
              </p>
              <p class="cart-item-meta">
                {{ movie.genre }}
              </p>
              <p class="cart-item-price">
                {{ movie.duration }}
              </p>
              <v-icon class="remove-icon" @click.stop="removeFavorite(movie.id)">
                mdi-heart-broken
              </v-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-footer">
        <div class="cart-buttons">
          <v-btn
            class="view-cart"
            outlined
            color="#db133b"
            @click="$emit('close')"
          >
            Seguir viendo
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      favoritesList: [],
      loading: false
    }
  },
  watch: {
    isOpen (val) {
      if (val) {
        this.loadFavorites()
      }
    }
  },
  mounted () {
    if (typeof window !== 'undefined') {
      window.addEventListener('update-hearts', this.loadFavorites)
    }
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('update-hearts', this.loadFavorites)
    }
  },
  methods: {
    async loadFavorites () {
      this.loading = true
      try {
        const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]')

        if (favoritesIds.length === 0) {
          this.favoritesList = []
          this.loading = false
          return
        }

        const response = await axios.get('http://localhost:5020/api/movies')
        const allMovies = Array.isArray(response.data) ? response.data : []

        this.favoritesList = allMovies
          .filter(movie => favoritesIds.includes(movie.id))
          .map(movie => ({
            id: movie.id,
            title: movie.title,
            genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : (movie.genre || ''),
            duration: movie.duration ? `${movie.duration} min` : '',
            image: movie.posterUrl || movie.image || 'https://via.placeholder.com/60x88'
          }))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error cargando favoritos:', error)
        this.favoritesList = []
      } finally {
        this.loading = false
      }
    },

    removeFavorite (id) {
      let favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]')
      favoritesIds = favoritesIds.filter(favId => favId !== id)
      localStorage.setItem('favorites', JSON.stringify(favoritesIds))
      this.favoritesList = this.favoritesList.filter(movie => movie.id !== id)
      window.dispatchEvent(new Event('update-hearts'))
    },

    goToMovie (id) {
      this.$emit('close')
      this.$router.push(`/product/${id}`)
    }
  }
}
</script>

<style scoped>
/* Estilos Modal */
.cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  background: rgba(0, 0, 0, 0.25);
}

.cart-modal-container {
  width: 380px;
  max-width: 100%;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: -4px 0 18px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  border-radius: 12px 0 0 12px;
  overflow: hidden;
}

.cart-header {
  width: 100%;
}

.cart-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #db133b;
  color: #ffffff;
  padding: 14px 18px;
}

.cart-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.close-icon {
  cursor: pointer;
  color: #ffffff;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px 8px;
  background-color: #fafafa;
}

.empty-cart-message {
  text-align: center;
  color: #777;
  padding: 40px 0;
  font-size: 0.95rem;
}

.cart-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 10px 10px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: background-color 0.2s;
}
.cart-item:hover {
  background-color: #f5f5f5;
}

.cart-item-image {
  width: 60px;
  height: 88px;
  object-fit: cover;
  border-radius: 6px;
}

.cart-item-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}

.cart-item-name {
  font-weight: 600;
  margin: 0 0 4px;
  font-size: 0.95rem;
  color: #1a1a1a;
}

.cart-item-meta {
  margin: 0;
  font-size: 0.8rem;
  color: #777;
}

.cart-item-price {
  margin: 8px 0 0;
  font-weight: 700;
  font-size: 0.95rem;
  color: #001f54;
}

.remove-icon {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  color: #c4c4c4;
  font-size: 20px;
  transition: color 0.2s, transform 0.1s;
}

.remove-icon:hover {
  color: #db133b;
  transform: scale(1.05);
}

.cart-footer {
  padding: 14px 18px 16px;
  border-top: 1px solid #eeeeee;
  background-color: #ffffff;
}

.cart-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.view-cart {
  border-radius: 999px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 8px 20px;
  width: 100%;
  justify-content: center;
}

@media (max-width: 600px) {
  .cart-modal-container {
    width: 100%;
    border-radius: 0;
  }
}
</style>
