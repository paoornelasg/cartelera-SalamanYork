<template>
  <v-app>
    <AppHeader />
    <v-main>
      <v-sheet
        v-if="movie"
        class="hero-section"
        dark
      >
        <v-img
          :src="movie.image"
          height="100vh"
          cover
          class="hero-background-image"
        />
        <div class="carousel-content-wrapper d-flex flex-column justify-center align-center fill-height">
          <v-container
            class="fill-height hero-content"
            style="max-width: 1200px;"
          >
            <v-row align="center">
              <v-col
                cols="12"
                md="4"
                class="d-flex justify-center justify-md-end"
              >
                <v-img
                  :src="movie.image"
                  max-height="380"
                  max-width="220"
                  contain
                  class="elevation-12 rounded-lg"
                />
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="text-white text-center text-md-left pl-md-8"
              >
                <v-chip
                  color="blue"
                  small
                  class="mb-3 font-weight-bold"
                >
                  Estreno
                </v-chip>
                <h1 class="text-h3 text-md-h2 font-weight-bold mb-2 white-text-no-shadow">
                  {{ movie.title }}
                </h1>
                <div class="d-flex justify-center justify-md-start mb-4">
                  <v-chip
                    small
                    outlined
                    dark
                    class="mr-2"
                  >
                    {{ movie.format }}
                  </v-chip>
                  <v-chip
                    small
                    outlined
                    dark
                    class="mr-2"
                  >
                    {{ movie.language }}
                  </v-chip>
                </div>
                <div class="mb-6">
                  <span class="text-h6">{{ movie.duration.split(' ')[0] }} min</span>
                  <span class="mx-2">•</span>
                  <span class="text-h6">{{ movie.genre.split(',')[0] }}</span>
                </div>
                <v-btn
                  color="blue"
                  x-large
                  class="mr-4 px-8"
                  @click="openTicketModal"
                >
                  Comprar boletos
                </v-btn>
                <v-btn
                  text
                  large
                  dark
                  class="px-8"
                  @click="showTrailerModal = true"
                >
                  <v-icon left>
                    mdi-play-circle
                  </v-icon>
                  Detalles y tráiler
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-sheet>

      <hr class="section-divider">

      <div
        v-if="relatedProducts.length"
        class="related-products-section"
      >
        <v-container style="max-width: 1200px;">
          <h3 class="section-title">
            Otras Películas
          </h3>
          <v-row class="justify-center">
            <v-col
              v-for="related in relatedProducts"
              :key="related.id"
              cols="6"
              md="3"
              class="d-flex"
            >
              <v-card
                class="product-card elevation-0 d-flex flex-column"
                @click="$router.push(`/product/${related.id}`)"
              >
                <v-img
                  :src="related.image"
                  height="500"
                  cover
                  class="product-image"
                />
                <v-card-text class="pa-4 flex-grow-1">
                  <div class="related-title text-h6 mb-1">
                    {{ related.title }}
                  </div>
                  <div class="text-body-2 text-grey-darken-2">
                    {{ related.genre }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <div
        v-if="isAdmin"
        class="buttons"
      >
        <v-btn
          color="#787777"
          @click="openAddModal"
        >
          Agregar Película
        </v-btn>
        <v-btn
          color="#874C4C"
          @click="openEditModal"
        >
          Editar
        </v-btn>
        <v-btn
          color="#ea8080"
          @click="showDeleteConfirm = true"
        >
          Eliminar
        </v-btn>
      </div>

      <!-- Modal de éxito -->
      <v-dialog
        v-if="movie"
        v-model="showSuccessModal"
        width="300"
        persistent
      >
        <v-card class="pa-4 text-center">
          <v-icon
            color="green"
            size="48"
          >
            mdi-check-circle
          </v-icon>
          <h3 class="mt-3">
            Boletos añadidos!
          </h3>
          <p class="text--secondary mt-2">
            Boleto(s) para ver {{ movie ? movie.title : 'Película' }} ha(n) sido añadido(s) al carrito.
          </p>
          <v-btn
            color="black"
            class="mt-4"
            dark
            @click="showSuccessModal = false"
          >
            OK
          </v-btn>
        </v-card>
      </v-dialog>

      <!-- Snackbar para alertas -->
      <v-snackbar
        v-model="alertaVisible"
        :color="alertaColor"
        top
        right
        :timeout="3000"
        rounded="pill"
      >
        {{ alerta }}
        <template #action="{ attrs }">
          <v-btn
            text
            icon
            v-bind="attrs"
            @click="alertaVisible = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

      <!-- Resto de modales... continuará en parte 2 -->

      <!-- Modal de compra de boletos -->
      <v-dialog
        v-model="showTicketModal"
        width="90%"
        max-width="1100px"
        content-class="movie-details-dialog"
      >
        <v-card>
          <v-toolbar
            dense
            flat
            color="#db133b"
            dark
          >
            <v-toolbar-title class="text-h6 font-weight-bold">
              Comprar boletos — {{ movie ? movie.title : '' }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn
              text
              @click="showTicketModal = false"
            >
              Cerrar
              <v-icon right>
                mdi-close
              </v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="px-6 pt-6 pb-2">
            <v-row>
              <v-col
                cols="12"
                md="4"
                class="text-center"
              >
                <v-img
                  v-if="movie"
                  :src="movie.image"
                  aspect-ratio="2/3"
                  class="mb-4"
                />
                <div v-if="movie">
                  <h3 class="info-title">
                    CLASIFICACIÓN
                  </h3>
                  <p class="info-name">
                    {{ movie.classification }}
                  </p>
                  <h3 class="info-title">
                    DURACIÓN
                  </h3>
                  <p class="info-name">
                    {{ movie.duration }}
                  </p>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="8"
              >
                <h3 class="info-title">
                  SELECCIONA TU FUNCIÓN
                </h3>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <div class="mb-2 font-weight-medium">
                      Tipo de sala
                    </div>
                    <v-radio-group
                      v-model="selectedCinema"
                      row
                      @change="onCinemaChange"
                    >
                      <v-radio
                        label="VIP"
                        value="VIP"
                      />
                      <v-radio
                        label="Normal"
                        value="Normal"
                      />
                    </v-radio-group>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <div class="mb-2 font-weight-medium">
                      Formato
                    </div>
                    <v-radio-group
                      v-model="selectedFormat"
                      row
                    >
                      <v-radio
                        label="2D"
                        value="2D"
                      />
                      <v-radio
                        label="3D"
                        value="3D"
                      />
                    </v-radio-group>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="selectedDateFormatted"
                          label="Fecha"
                          readonly
                          v-bind="attrs"
                          outlined
                          dense
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="selectedDate"
                        :min="minDate"
                        :max="maxDate"
                        @input="menu = false"
                      />
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-select
                      v-model="selectedTime"
                      :items="timeOptions"
                      label="Hora"
                      outlined
                      dense
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model.number="ticketQty"
                      label="Cantidad"
                      type="number"
                      min="1"
                      :max="availableSeats"
                      outlined
                      dense
                    />
                    <div
                      v-if="availableSeats !== null"
                      class="mt-2 text-caption"
                    >
                      Disponibles: {{ availableSeats }}
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      label="Precio unitario"
                      :value="formatPrice(ticketUnitPrice)"
                      readonly
                      outlined
                      dense
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-6 pb-4">
            <v-spacer />
            <v-btn
              text
              @click="showTicketModal = false"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="#db133b"
              dark
              @click="submitTicketOrder"
            >
              Añadir al carrito
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal de advertencia -->
      <v-dialog
        v-model="showWarningModal"
        width="300"
        persistent
      >
        <v-card class="pa-4 text-center">
          <v-icon
            color="orange"
            size="48"
          >
            mdi-alert-circle
          </v-icon>
          <h3 class="mt-3">
            Selección incompleta
          </h3>
          <p class="text--secondary mt-2">
            Por favor completa todos los campos requeridos antes de continuar.
          </p>
          <v-btn
            color="black"
            class="mt-4"
            dark
            @click="showWarningModal = false"
          >
            Entendido
          </v-btn>
        </v-card>
      </v-dialog>

      <!-- Modal CRUD de película -->
      <v-dialog
        v-model="showProductModal"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title class="text-h6">
            {{ isEditing ? 'Editar Película' : 'Añadir Película' }}
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="form.name"
              label="Nombre de la película"
              outlined
              dense
            />
            <v-textarea
              v-model="form.description"
              label="Sinopsis"
              outlined
              dense
            />
            <v-text-field
              v-model="form.genre"
              label="Género (separados por coma)"
              outlined
              dense
            />
            <v-text-field
              v-model="form.rating"
              label="Clasificación (ej. PG-13, R)"
              outlined
              dense
            />
            <v-text-field
              v-model="form.duration"
              label="Duración (minutos)"
              type="number"
              outlined
              dense
            />
            <v-text-field
              v-model="form.director"
              label="Director"
              outlined
              dense
            />
            <v-text-field
              v-model="form.actors"
              label="Actores (separados por comas)"
              outlined
              dense
            />
            <v-text-field
              v-model="form.trailerUrl"
              label="URL del tráiler (YouTube)"
              outlined
              dense
            />
            <v-text-field
              v-model="form.language"
              label="Idioma"
              outlined
              dense
            />
            <v-text-field
              v-model="form.format"
              label="Formato (ej. 2D, 3D)"
              outlined
              dense
            />
            <v-text-field
              v-model="form.releaseDate"
              label="Fecha de estreno (YYYY-MM-DD)"
              outlined
              dense
            />
            <v-switch
              v-model="form.isBillboard"
              label="En cartelera"
              inset
            />
            <v-file-input
              label="Póster de la película"
              outlined
              dense
              accept="image/*"
              @change="onImageSelected"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="showProductModal = false"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="black"
              dark
              @click="submitProduct"
            >
              {{ isEditing ? 'Actualizar' : 'Añadir' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal de confirmación de eliminación -->
      <v-dialog
        v-model="showDeleteConfirm"
        width="400"
      >
        <v-card class="pa-4 text-center">
          <v-icon
            color="red"
            size="48"
          >
            mdi-alert
          </v-icon>
          <h3 class="mt-3">
            Eliminar Película
          </h3>
          <p class="text--secondary mt-2">
            ¿Estás seguro de que quieres eliminar esta película?
          </p>
          <v-card-actions class="justify-center mt-4">
            <v-btn
              color="grey"
              @click="showDeleteConfirm = false"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="error"
              @click="confirmDelete"
            >
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal de tráiler y detalles -->
      <v-dialog
        v-model="showTrailerModal"
        width="90%"
        max-width="1100px"
        content-class="movie-details-dialog"
        @click:outside="showTrailerModal = false"
      >
        <v-card color="white">
          <v-toolbar
            dense
            flat
            color="#db133b"
            dark
          >
            <v-toolbar-title class="text-h6 font-weight-bold">
              {{ movie ? movie.title : 'Detalles de la película' }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn
              text
              @click="showTrailerModal = false"
            >
              Cerrar
              <v-icon right>
                mdi-close
              </v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text v-if="movie">
            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <v-img
                  :src="movie.image"
                  aspect-ratio="2/3"
                  class="mb-4"
                />
                <h3 class="info-title">
                  DIRECCIÓN
                </h3>
                <div class="info-item">
                  <v-icon
                    class="info-icon"
                    size="32"
                    color="#001f54"
                  >
                    mdi-account-circle
                  </v-icon>
                  <span class="info-name">{{ movie.director || 'Director desconocido' }}</span>
                </div>
                <h3 class="info-title">
                  ACTORES
                </h3>
                <div
                  v-for="actor in movie.actors"
                  :key="actor + '-modal'"
                  class="info-item"
                >
                  <v-icon
                    class="info-icon"
                    size="28"
                    color="#001f54"
                  >
                    mdi-account-circle
                  </v-icon>
                  <span class="info-name">{{ actor }}</span>
                </div>
                <p
                  v-if="!movie.actors || !movie.actors.length"
                  class="info-name"
                >
                  Sin información disponible
                </p>
              </v-col>
              <v-col
                cols="12"
                md="8"
              >
                <h3 class="info-title">
                  SINOPSIS
                </h3>
                <p class="info-text">
                  {{ movie.sinopsis }}
                </p>
                <v-row>
                  <v-col cols="6">
                    <h3 class="info-title">
                      CLASIFICACIÓN
                    </h3>
                    <p class="info-value">
                      {{ movie.classification }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <h3 class="info-title">
                      DURACIÓN
                    </h3>
                    <p class="info-value">
                      {{ movie.duration }}
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <h3 class="info-title">
                      FORMATO
                    </h3>
                    <p class="info-name">
                      {{ movie.format }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <h3 class="info-title">
                      IDIOMA
                    </h3>
                    <p class="info-name">
                      {{ movie.language }}
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <h3 class="info-title">
                      FECHA DE ESTRENO
                    </h3>
                    <p class="info-name">
                      {{ releaseDateText }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <h3 class="info-title">
                      GÉNERO
                    </h3>
                    <p class="info-name">
                      {{ genreText }}
                    </p>
                  </v-col>
                </v-row>
                <h3 class="info-title">
                  TRÁILER
                </h3>
                <v-responsive :aspect-ratio="16/9">
                  <iframe
                    :src="videoSrc"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  />
                </v-responsive>
                <h3 class="info-title mt-4">
                  INFORMACIÓN ADICIONAL
                </h3>
                <p class="info-text">
                  Más detalles de la película estarán disponibles próximamente.
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
    <PageFooter />
  </v-app>
</template>

<script>
import axios from 'axios'
import AppHeader from '~/components/PageHeader.vue'
import PageFooter from '~/components/PageFooter.vue'

const MOVIES_API = 'http://localhost:5020/api/movies'

export default {
  components: {
    AppHeader,
    PageFooter
  },
  data () {
    return {
      movie: null,
      isAdmin: false,
      relatedProducts: [],
      showTicketModal: false,
      selectedCinema: '',
      selectedFormat: '',
      selectedDate: null,
      selectedDateFormatted: '',
      menu: false,
      selectedTime: '',
      timeOptions: ['11:00', '14:00', '16:00', '18:00', '20:00'],
      ticketQty: 1,
      availableSeats: null,
      ticketUnitPrice: 0,
      showSuccessModal: false,
      showWarningModal: false,
      showProductModal: false,
      showDeleteConfirm: false,
      showTrailerModal: false,
      isEditing: false,
      // Sistema de alertas añadido
      alerta: '',
      alertaColor: '',
      alertaVisible: false,
      form: {
        name: '',
        description: '',
        genre: '',
        rating: '',
        duration: '',
        language: '',
        format: '',
        releaseDate: '',
        director: '',
        actors: '',
        trailerUrl: '',
        isBillboard: true,
        image: '',
        imageFile: null
      }
    }
  },
  computed: {
    videoSrc () {
      if (this.movie && this.movie.trailerUrl && this.showTrailerModal) {
        const base = this.movie.trailerUrl
        if (base.includes('?')) {
          return base + '&autoplay=1'
        }
        return base + '?autoplay=1'
      }
      return ''
    },
    releaseDateText () {
      if (!this.movie || !this.movie.releaseDate) {
        return ''
      }
      const ts = typeof this.movie.releaseDate === 'number'
        ? this.movie.releaseDate
        : Number(this.movie.releaseDate)
      if (!ts) {
        return ''
      }
      const d = new Date(ts)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}/${month}/${year}`
    },
    genreText () {
      if (!this.movie || !this.movie.genre) {
        return ''
      }
      if (Array.isArray(this.movie.genre)) {
        return this.movie.genre.join(', ')
      }
      return this.movie.genre
    },
    actorsText () {
      if (!this.movie || !this.movie.actors) {
        return ''
      }
      if (Array.isArray(this.movie.actors)) {
        return this.movie.actors.join(', ')
      }
      return this.movie.actors
    },
    minDate () {
      const d = new Date()
      return d.toISOString().substring(0, 10)
    },
    maxDate () {
      const d = new Date()
      d.setDate(d.getDate() + 6)
      return d.toISOString().substring(0, 10)
    }
  },
  watch: {
    selectedCinema (newVal) {
      this.ticketUnitPrice = newVal === 'VIP' ? 200 : 100
      this.fetchAvailability()
    },
    selectedDate: {
      handler () {
        this.updateSelectedDateFormatted()
        this.fetchAvailability()
      }
    },
    selectedTime () {
      this.fetchAvailability()
    },
    selectedFormat () {
      this.fetchAvailability()
    },
    ticketQty (newVal) {
      if (newVal > 50) {
        this.ticketQty = 50
      } else if (newVal < 1) {
        this.ticketQty = 1
      }
      if (this.availableSeats !== null && this.ticketQty > this.availableSeats) {
        this.ticketQty = this.availableSeats
      }
    }
  },
  mounted: async function () {
    await this.fetchProduct()
    this.checkAdmin()
    await this.fetchRelatedProducts()
  },
  methods: {
    // Método para mostrar alertas (copiado del primer script)
    mostrarAlerta (mensaje, tipo = 'info') {
      this.alerta = mensaje
      if (tipo === 'error') {
        this.alertaColor = 'red darken-2'
      } else if (tipo === 'success') {
        this.alertaColor = 'green darken-1'
      } else if (tipo === 'warning') {
        this.alertaColor = 'orange darken-2'
      } else {
        this.alertaColor = 'blue darken-1'
      }
      this.alertaVisible = true
    },

    async fetchRelatedProducts () {
      try {
        const { data } = await axios.get(MOVIES_API)
        const currentId = this.movie?.id
        const others = (Array.isArray(data) ? data : [])
          .filter(m => m.id !== currentId)
        this.relatedProducts = others
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)
          .map(movie => ({
            ...movie,
            name: movie.title,
            image: movie.posterUrl || movie.image || ''
          }))
      } catch (err) {
        console.error('Error al cargar las películas relacionadas', err.response?.data || err.message)
        this.mostrarAlerta('Error al cargar películas relacionadas', 'error')
        this.relatedProducts = []
      }
    },

    async fetchProduct () {
      try {
        const id = this.$route.params.id
        const { data } = await axios.get(`${MOVIES_API}/${id}`)
        const genreStr = Array.isArray(data.genre)
          ? data.genre.join(', ')
          : (data.genre || '')
        const durationStr = data.duration ? `${data.duration} min` : ''
        this.movie = {
          ...data,
          isBillboard: !!data.isBillboard,
          name: data.title,
          description: data.synopsis,
          sinopsis: data.synopsis,
          genre: genreStr,
          duration: durationStr,
          classification: data.rating || '',
          language: data.language || '',
          format: data.format || '',
          image: data.posterUrl || data.image || '',
          backgroundImage: data.posterUrl || data.image || '',
          director: data.director || '',
          actors: Array.isArray(data.actors)
            ? data.actors
            : (data.actors || []),
          trailerUrl: data.trailerUrl || ''
        }
        this.currentImage = this.movie.image
      } catch (err) {
        console.error('Error al obtener película', err.response?.data || err.message)
        this.mostrarAlerta('Error al cargar la película', 'error')
        this.movie = null
      }
    },

    openTicketModal () {
      if (!this.movie) {
        return
      }
      this.selectedCinema = 'Normal'
      this.selectedDate = new Date().toISOString().substring(0, 10)
      this.selectedDateFormatted = this.selectedDate
      this.selectedTime = this.timeOptions && this.timeOptions.length ? this.timeOptions[0] : ''
      this.ticketQty = 1
      this.ticketUnitPrice = this.selectedCinema === 'VIP' ? 200 : 100
      if (this.movie.format && this.movie.format.includes('3D')) {
        this.selectedFormat = '3D'
      } else {
        this.selectedFormat = '2D'
      }
      this.showTicketModal = true
      this.fetchAvailability()
    },

    updateSelectedDateFormatted () {
      if (!this.selectedDate) {
        this.selectedDateFormatted = ''
        return
      }
      this.selectedDateFormatted = String(this.selectedDate)
    },

    onCinemaChange (val) {
      this.ticketUnitPrice = val === 'VIP' ? 200 : 100
    },

    formatPrice (val) {
      if (val == null) {
        return ''
      }
      return `$ ${Number(val)}`
    },

    async submitTicketOrder () {
      if (!this.selectedCinema || !this.selectedDate || !this.selectedTime || !this.ticketQty || this.ticketQty < 1 || !this.selectedFormat) {
        this.showWarningModal = true
        this.mostrarAlerta('Por favor completa todos los campos', 'warning')
        return
      }
      if (this.ticketQty > 50) {
        this.mostrarAlerta('El máximo por función es 50 boletos', 'warning')
        return
      }
      if (this.availableSeats !== null && this.ticketQty > this.availableSeats) {
        this.mostrarAlerta(`Solo quedan ${this.availableSeats} boletos disponibles para esta función`, 'warning')
        return
      }

      const storedUser = (() => {
        try {
          return JSON.parse(localStorage.getItem('user') || 'null')
        } catch (e) {
          return null
        }
      })()

      const payload = {
        userId: storedUser?.id || storedUser?.uid || null,
        movieId: this.movie.id,
        movieTitle: this.movie.title,
        poster: this.movie.posterUrl || this.movie.image || '',
        cinema: this.selectedCinema,
        format: this.selectedFormat || this.movie.format || null,
        showDate: new Date(this.selectedDate).getTime(),
        showTime: this.selectedTime,
        qty: Number(this.ticketQty),
        unitPrice: Number(this.ticketUnitPrice)
      }

      try {
        const { data: created } = await this.$axios.post('http://localhost:5020/api/orders/cart/add', payload)
        this.showTicketModal = false
        this.showSuccessModal = true
        this.showWarningModal = false
        this.mostrarAlerta('Boletos añadidos al carrito exitosamente', 'success')

        const carrito = JSON.parse(localStorage.getItem('carrito') || '[]')
        const incoming = {
          id: created.id || created.ID || created.id,
          movieId: payload.movieId,
          name: this.movie.title,
          movieTitle: this.movie.title,
          image: this.movie.posterUrl || this.movie.image || '',
          poster: this.movie.posterUrl || this.movie.image || '',
          cinema: payload.cinema,
          format: payload.format,
          showDate: payload.showDate,
          showTime: payload.showTime,
          qty: payload.qty,
          quantity: payload.qty,
          unitPrice: payload.unitPrice,
          price: payload.unitPrice,
          subtotal: payload.qty * payload.unitPrice
        }

        const matchIndex = carrito.findIndex(it =>
          (it.movieId === incoming.movieId || it.id === incoming.movieId || it.id === incoming.movieId) &&
          it.cinema === incoming.cinema &&
          String(it.showDate) === String(incoming.showDate) &&
          it.showTime === incoming.showTime &&
          (it.format === incoming.format)
        )

        if (matchIndex !== -1) {
          const existing = carrito[matchIndex]
          existing.qty = (Number(existing.qty) || Number(existing.quantity) || 0) + Number(incoming.qty)
          existing.quantity = existing.qty
          existing.subtotal = (existing.unitPrice || existing.price) * existing.qty
          carrito[matchIndex] = existing
        } else {
          carrito.push(incoming)
        }

        localStorage.setItem('carrito', JSON.stringify(carrito))
        window.dispatchEvent(new Event('carrito-actualizado'))
        this.fetchAvailability()
      } catch (err) {
        console.error(err.response?.data || err.message)
        const msg = err.response?.data?.message || 'Error al añadir al carrito'
        this.mostrarAlerta(msg, 'error')
      }
    },

    async fetchAvailability () {
      if (!this.movie || !this.selectedCinema || !this.selectedDate || !this.selectedTime) {
        this.availableSeats = null
        return
      }
      const params = {
        movieId: this.movie.id,
        cinema: this.selectedCinema,
        format: this.selectedFormat || this.movie.format || null,
        showDate: new Date(this.selectedDate).getTime(),
        showTime: this.selectedTime
      }
      try {
        const client = this.$axios || axios
        const { data } = await client.get('http://localhost:5020/api/orders/shows/availability', { params })
        this.availableSeats = data.available
      } catch (err) {
        console.error('Error fetching availability', err.response?.data || err.message)
        this.availableSeats = null
      }
    },

    increaseQty () {
      this.quantity++
    },

    decreaseQty () {
      if (this.quantity > 1) {
        this.quantity--
      }
    },

    addToCart () {
      if (!this.selectedSize || !this.selectedColor) {
        this.showWarningModal = true
        return
      }
      const carrito = JSON.parse(localStorage.getItem('carrito')) || []
      const existente = carrito.find(p =>
        p.id === this.movie.id &&
        p.size === this.selectedSize &&
        p.color === this.selectedColor
      )
      if (existente) {
        existente.quantity += this.quantity
      } else {
        carrito.push({
          id: this.movie.id,
          name: this.movie.title,
          price: this.movie.price,
          image: this.movie.image,
          size: this.selectedSize,
          color: this.selectedColor,
          quantity: this.quantity
        })
      }
      localStorage.setItem('carrito', JSON.stringify(carrito))
      window.dispatchEvent(new Event('carrito-actualizado'))
      this.showSuccessModal = true
    },

    deleteProduct () {
      axios.delete(`${MOVIES_API}/delete/${this.movie.id}`)
        .then(() => {
          this.mostrarAlerta('Película eliminada exitosamente', 'success')
          setTimeout(() => {
            this.$router.push('/shop')
          }, 1000)
        })
        .catch((err) => {
          console.error('Error al eliminar película', err.response?.data || err.message)
          this.mostrarAlerta('Error al eliminar la película', 'error')
        })
    },

    checkAdmin () {
      const userStr = localStorage.getItem('user')
      try {
        const user = JSON.parse(userStr)
        this.isAdmin = user?.rol === 'admin'
      } catch (err) {
        this.isAdmin = false
      }
    },

    generateSku (name) {
      if (!name) {
        return 'SKU-00000'
      }
      const base = name.replace(/\s+/g, '').substring(0, 3).toUpperCase()
      const random = Math.floor(1000 + Math.random() * 9000)
      return `SKU-${base}${random}`
    },

    generateTags (desc) {
      if (!desc || typeof desc !== 'string') {
        return ['general']
      }
      const words = desc.split(/\W+/).filter(w => w.length > 4)
      return [...new Set(words.slice(0, 3).map(w => w.toLowerCase()))]
    },

    // Continuará en parte 3...

    openEditModal () {
      this.isEditing = true
      this.form = {
        name: this.movie.title || '',
        description: this.movie.synopsis || this.movie.sinopsis || '',
        genre: Array.isArray(this.movie.genre)
          ? this.movie.genre.join(', ')
          : (this.movie.genre || ''),
        rating: this.movie.rating || '',
        duration: this.movie.duration ? String(this.movie.duration) : '',
        language: this.movie.language || '',
        format: this.movie.format || '',
        releaseDate: this.movie.releaseDate
          ? new Date(this.movie.releaseDate).toISOString().substring(0, 10)
          : '',
        director: this.movie.director || '',
        actors: Array.isArray(this.movie.actors)
          ? this.movie.actors.join(', ')
          : (this.movie.actors || ''),
        trailerUrl: this.movie.trailerUrl || '',
        isBillboard: !!this.movie.isBillboard,
        image: this.movie.posterUrl || this.movie.image || '',
        imageFile: null
      }
      this.showProductModal = true
    },

    openAddModal () {
      this.isEditing = false
      this.form = {
        name: '',
        description: '',
        genre: '',
        rating: '',
        duration: '',
        language: '',
        format: '',
        releaseDate: '',
        director: '',
        actors: '',
        trailerUrl: '',
        isBillboard: true,
        image: '',
        imageFile: null
      }
      this.showProductModal = true
    },

    async submitProduct () {
      try {
        if (!this.form.name || !this.form.description) {
          this.mostrarAlerta('El título y la sinopsis son requeridos', 'warning')
          return
        }

        const formData = new FormData()
        formData.append('title', this.form.name)
        formData.append('synopsis', this.form.description)
        if (this.form.genre) {
          formData.append('genre', this.form.genre)
        }
        if (this.form.rating) {
          formData.append('rating', this.form.rating)
        }
        if (this.form.duration) {
          formData.append('duration', this.form.duration)
        }
        if (this.form.language) {
          formData.append('language', this.form.language)
        }
        if (this.form.format) {
          formData.append('format', this.form.format)
        }
        if (this.form.releaseDate) {
          formData.append('releaseDate', this.form.releaseDate)
        }
        if (this.form.director) {
          formData.append('director', this.form.director)
        }
        if (this.form.actors) {
          formData.append('actors', this.form.actors)
        }
        if (this.form.trailerUrl) {
          formData.append('trailerUrl', this.form.trailerUrl)
        }
        formData.append('isBillboard', this.form.isBillboard ? 'true' : 'false')
        if (this.form.imageFile) {
          formData.append('poster', this.form.imageFile)
        }

        let url
        let method
        if (this.isEditing && this.movie && this.movie.id) {
          url = `${MOVIES_API}/update/${this.movie.id}`
          method = 'put'
        } else {
          url = `${MOVIES_API}/create`
          method = 'post'
        }

        const { data } = await axios[method](url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        const mensaje = this.isEditing
          ? 'Película actualizada correctamente'
          : 'Película creada exitosamente'
        this.mostrarAlerta(mensaje, 'success')

        this.showProductModal = false

        if (!this.isEditing && data?.id) {
          setTimeout(() => {
            this.$router.push(`/product/${data.id}`)
          }, 1000)
        } else {
          await this.fetchProduct()
          await this.fetchRelatedProducts()
        }
      } catch (err) {
        console.error('Error al guardar película', err.response?.data || err.message)
        const msg = err.response?.data?.message || 'Error al guardar la película'
        this.mostrarAlerta(msg, 'error')
      }
    },

    onImageSelected (file) {
      this.form.imageFile = file
    },

    confirmDelete () {
      this.deleteProduct()
      this.showDeleteConfirm = false
    }
  }
}
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(60%) blur(2px);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 100%;
  color: #fff;
  text-align: left;
  padding: 40px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.white-text-no-shadow {
  color: white;
  text-shadow: none;
}

.details-section {
  padding: 20px;
}

.details-and-related-wrapper {
  background-color: white;
  z-index: 3;
  position: relative;
}

.details.container {
  padding: 60px 50px;
  color: #001f54;
}

.info-block {
  margin-bottom: 40px;
}

.info-title {
  font-weight: 800;
  font-size: 1.1rem;
  color: #001f54;
  text-transform: uppercase;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.info-name {
  font-size: 1rem;
  font-weight: 500;
  color: #001f54;
  padding-left: 8px;
}

.info-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #1a1a1a;
  padding-right: 270px;
}

.info-value {
  font-weight: 900;
  font-size: 2.3rem;
  color: #001f54;
  margin: 0;
}

.left-column {
  padding-left: 300px;
}

.right-column {
  padding-left: 20px;
}

.section-divider-light {
  margin: 20px 0;
  border: none;
  border-top: 2px solid #e5e5e5;
  width: 68%;
}

@media (max-width: 960px) {
  .left-column {
    border-right: none;
    border-bottom: 2px solid #e5e5e5;
    padding-bottom: 30px;
    margin-bottom: 30px;
  }
  .right-column {
    padding-left: 70px;
  }

  .info-text {
    padding-right: 70px;
  }
  .section-divider-light {
    width: 90%;
  }
}

* {
  box-sizing: border-box;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-divider {
  margin: 40px auto;
  border: none;
  border-top: 1px solid #eee;
  width: 90%;
}

.related-products-section {
  text-align: center;
  margin: 0 80px;
  padding: 40px 0;
}

.section-title {
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 30px;
}

.product-card {
  width: 100%;
  text-align: center;
  cursor: pointer;
}

.related-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

html,
body,
#__nuxt,
#__layout,
.v-application,
.v-main {
  margin: 0;
  padding: 0;
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
}

.movie-details-dialog {
  display: flex !important;
  justify-content: flex-end !important;
  align-items: flex-start !important;
}

.movie-details-dialog .v-card {
  margin-right: 16px;
}

.movie-details-dialog .v-toolbar__title {
  padding-left: 16px;
}
</style>
