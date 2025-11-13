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
                  <span class="text-h6">{{ movie.duration.split(' ')[0] }}</span>
                  <span class="mx-2">•</span>
                  <span class="text-h6">{{ movie.genre.split(',')[0] }}</span>
                </div>
                <v-btn
                  color="blue"
                  x-large
                  class="mr-4 px-8"
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
          color="#9bdff3"
          @click="openAddModal"
        >
          Add Product
        </v-btn>
        <v-btn
          color="#f3f19a"
          @click="openEditModal"
        >
          Edit
        </v-btn>
        <v-btn
          color="#ea8080"
          @click="showDeleteConfirm = true"
        >
          Delete
        </v-btn>
      </div>

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
            Product Added!
          </h3>
          <p class="text--secondary mt-2">
            {{ movie ? movie.title : 'Product' }} has been added to the cart.
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
            Missing Selection
          </h3>
          <p class="text--secondary mt-2">
            Please select a size and color before adding the product to the cart.
          </p>
          <v-btn
            color="black"
            class="mt-4"
            dark
            @click="showWarningModal = false"
          >
            Got it
          </v-btn>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="showProductModal"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title class="text-h6">
            {{ isEditing ? 'Edit Product' : 'Add Product' }}
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="form.name"
              label="Product Name"
              outlined
              dense
            />
            <v-textarea
              v-model="form.description"
              label="Description"
              outlined
              dense
            />
            <v-text-field
              v-model="form.price"
              label="Price"
              type="number"
              outlined
              dense
            />
            <v-text-field
              v-model="form.stock"
              label="Stock"
              type="number"
              outlined
              dense
            />
            <v-text-field
              v-model="form.category"
              label="Category"
              outlined
              dense
            />
            <v-text-field
              v-model="form.brand"
              label="Brand"
              outlined
              dense
            />
            <v-text-field
              v-model="form.weight"
              label="Weight"
              outlined
              dense
            />
            <v-text-field
              v-model="form.dimensions"
              label="Dimensions"
              outlined
              dense
            />
            <v-text-field
              v-model="form.color"
              label="Color"
              outlined
              dense
            />
            <v-text-field
              v-model="form.material"
              label="Material"
              outlined
              dense
            />
            <v-file-input
              label="Upload Image"
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
              Cancel
            </v-btn>
            <v-btn
              color="black"
              dark
              @click="submitProduct"
            >
              {{ isEditing ? 'Update' : 'Add' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
            Delete Product
          </h3>
          <p class="text--secondary mt-2">
            Are you sure you want to delete this product?
          </p>
          <v-card-actions class="justify-center mt-4">
            <v-btn
              color="grey"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              @click="confirmDelete"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
                  <span class="info-name">{{ movie.director.name }}</span>
                </div>
                <h3 class="info-title">
                  ACTORES
                </h3>
                <div
                  v-for="actor in movie.actors"
                  :key="actor.name + '-modal'"
                  class="info-item"
                >
                  <v-icon
                    class="info-icon"
                    size="28"
                    color="#001f54"
                  >
                    mdi-account-circle
                  </v-icon>
                  <span class="info-name">{{ actor.name }}</span>
                </div>
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
                      {{ movie.releaseDate }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <h3 class="info-title">
                      GÉNERO
                    </h3>
                    <p class="info-name">
                      {{ movie.genre }}
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

const allMovies = [
  { id: 1, title: 'Tron: Ares', genre: 'Ciencia Ficción, Acción', duration: '2h 17min', classification: 'A', format: 'Premium', language: 'Inglés', releaseDate: '2025-10-10', image: 'https://statics.cinemex.com/movie_posters/4I2SJBNiirJV6Hi-360x540.jpg', sinopsis: 'TRON: ARES sigue a un sofisticado Programa, Ares, que es enviado desde el mundo digital al mundo real en una peligrosa misión, marcando el primer encuentro de la humanidad con seres de Inteligencia Artificial.', director: { name: 'Joachim Rønning' }, actors: [{ name: 'Jared Leto' }, { name: 'Evan Peters' }, { name: 'Greta Lee' }], trailerUrl: 'https://www.youtube.com/embed/zvahPW14Qos' },
  { id: 2, title: 'El Teléfono Negro 2', genre: 'Terror, Suspenso', duration: '1h 54min', classification: 'B-15', format: 'Tradicional', language: 'Inglés', releaseDate: '2025-10-17', image: 'https://statics.cinemex.com/movie_posters/ptdF3hn934zNJD3-360x540.jpg', sinopsis: 'Finney, Ahora De 17 Años, Lucha Con Las Secuelas De Su Cautiverio Mientras Su Hermana Comienza A Recibir Llamadas En Sueños Desde El Teléfono Negro Y Visiones Inquietantes De Tres Chicos Acechados En Un Campamento De Invierno Llamado Alpine Lake.', director: { name: 'Scott Derrickson' }, actors: [{ name: 'Ethan Hawke' }, { name: 'Mason Thames' }, { name: 'Madeleine Mcgraw' }], trailerUrl: 'https://www.youtube.com/embed/YvqwkLg9o6k' },
  { id: 3, title: 'Chainsaw Man La Película: Arco de Reze', genre: 'Animación, Acción, Fantasía', duration: '1h 40min', classification: 'B-15', format: '3D', language: 'Japonés', releaseDate: '2025-10-24', image: 'https://statics.cinemex.com/movie_posters/UjGW90lTGlcnDEz-360x540.jpg', sinopsis: 'Por primera vez, Chainsaw Man llega a la gran pantalla en una épica aventura cargada de acción que continúa la exitosa serie de anime. Denji trabajaba como Cazador de Demonios para los yakuza, intentando saldar la deuda que heredó de sus padres, hasta que fue traicionado y asesinado por ellos. Al borde de la muerte, su querido perro-demonio con motosierra, Pochita, hizo un pacto con él y le salvó la vida. Esto los fusionó, dando origen al imparable Chainsaw Man. Ahora, en medio de una guerra brutal entre demonios, cazadores y enemigos ocultos, una misteriosa chica llamada Reze entra en su vida, y Denji se enfrenta a la batalla más peligrosa hasta ahora, impulsado por el amor en un mundo donde la supervivencia no tiene reglas.', director: { name: 'Tatsuya Yoshihara' }, actors: [{ name: 'Kikunosuke Toya' }, { name: 'Reina Ueda' }, { name: 'Tomori Kusunoki' }], trailerUrl: 'https://www.youtube.com/embed/eRXMdJoXRGQ' },
  { id: 4, title: 'Cacería De Brujas', genre: 'Terror, Suspenso', duration: '2h 19min', classification: 'B-15', format: 'Tradicional', language: 'Inglés', releaseDate: '2025-10-31', image: 'https://statics.cinemex.com/movie_posters/czV5cp4B5CgKL0I-360x540.jpg', sinopsis: 'Una profesora universitaria se encuentra en una encrucijada personal y profesional cuando una alumna estrella lanza una acusación contra uno de sus colegas y un oscuro secreto de su propio pasado amenaza con salir a la luz.', director: { name: 'Luca Guadagnino' }, actors: [{ name: 'Julia Roberts' }, { name: 'Andrew Garfield' }, { name: 'Ayo Edebiri' }], trailerUrl: 'https://www.youtube.com/embed/2yNBkz7ULtY' },
  { id: 5, title: 'A Pesar De Ti', genre: 'Comedia, Romance', duration: '2h 0min', classification: 'B', format: 'Tradicional', language: 'Español', releaseDate: '2025-10-17', image: 'https://statics.cinemex.com/movie_posters/njJOQEPIaJ0iJ7o-360x540.jpg', sinopsis: 'Basada en el libro superventas, A PESAR DE TI presenta al público a Morgan Grant (Allison Williams) y su hija Clara (Mckenna Grace). Ellas exploran lo que queda tras un accidente devastador que revela una traición impactante y les obliga a afrontar secretos familiares, redefinir el amor y redescubrirse. A PESAR DE TI es una historia de crecimiento, resiliencia y autodescubrimiento tras una tragedia, también protagonizada por Dave Franco y Mason Thames, junto a Scott Eastwood y Willa Fitzgerald.', director: { name: 'Josh Boone' }, actors: [{ name: 'Allison Williams' }, { name: 'Mckenna Grace' }, { name: 'Dave Franco' }], trailerUrl: 'https://www.youtube.com/embed/tJql7yk5r00' },
  { id: 6, title: 'Springsteen: Música De Ninguna Parte', genre: 'Documental, Música', duration: '2h 0min', classification: 'B', format: 'Tradicional', language: 'Inglés', releaseDate: '2025-11-01', image: 'https://statics.cinemex.com/movie_posters/1w5od7S4ry9dZP2-360x540.jpg', sinopsis: 'Representación del proceso creativo de Bruce Springsteen detrás de su álbum Nebraska de 1982, mientras grababa Born in the USA con la E Street Band. Basado en el libro de Warren Zanes.', director: { name: 'Scott Cooper' }, actors: [{ name: 'Jeremy Allen White' }, { name: 'Jeremy Strong' }, { name: 'Grace Gummer' }], trailerUrl: 'https://www.youtube.com/embed/oQXdM3J33No' },
  { id: 7, title: 'Good Boy: Confía En Su Instinto', genre: 'Terror, Suspenso', duration: '1h 12min', classification: 'B', format: 'Premium', language: 'Inglés', releaseDate: '2025-10-24', image: 'https://statics.cinemex.com/movie_posters/EUrNvNXmw8rUAhi-360x540.jpg', sinopsis: 'Un perro leal se muda con su dueño, Todd, a una casa familiar en el campo, donde descubre fuerzas sobrenaturales que acechan en las sombras. Cuando entidades oscuras amenazan a su compañero humano, el valiente animal deberá enfrentarse a ellas para proteger al ser que más ama.', director: { name: 'Ben Leonberg' }, actors: [{ name: 'Arielle Friedman' }, { name: 'Shane Jensen' }, { name: 'Larry Fessenden' }], trailerUrl: 'https://www.youtube.com/embed/q4-CRkd_74g' },
  { id: 8, title: 'Amor Fuera de Tiempo', genre: 'Romance, Drama, Fantasía', duration: '1h 39min', classification: 'B', format: 'Tradicional', language: 'Inglés', releaseDate: '2025-10-10', image: 'https://tickets-static-content.cinepolis.com/pimcore/9618/assets/Mexico/Tickets/Movies/AmorFueraDeTiempo/Es/Poster_720x1022_copia_2_/resource.jpg', sinopsis: 'Dallas, una estudiante determinada que sueña con entrar a la mejor escuela de danza del país, se cruza con Drayton, el mariscal de campo estrella que duda sobre su futuro. La química entre ellos es innegable, pero sus ambiciones opuestas ponen a prueba si el amor puede superar sus diferencias.', director: { name: 'Justin Wu' }, actors: [{ name: 'Siena Agudong' }, { name: 'Noah Beck' }, { name: 'Drew Ray Tanner' }], trailerUrl: 'https://www.youtube.com/embed/-3itEzH1-EI' },
  { id: 9, title: 'Cuando El Cielo Se Equivoca', genre: 'Comedia, Drama', duration: '1h 38min', classification: 'B', format: 'Tradicional', language: 'Español', releaseDate: '2025-10-31', image: 'https://statics.cinemex.com/movie_posters/SMuqdJXLQnRahiI-360x540.jpg', sinopsis: 'Cuando Gabriel (Keanu Reeves) un ángel guardián bien intencionado pero inepto interviene en la vida Arj (Aziz Ansari) -un desempleado que vive en su coche- intercambiando su vida con la del adinerado Jeff (Seth Rogen) descubre que la buena fortuna trae problemas en esta comedia social de enredos celestiales y tacos al pastor.​​ Gabriel desea demostrarle a Arj que la riqueza no arregla todos sus problemas…¿o sí?', director: { name: 'Aziz Ansari' }, actors: [{ name: 'Seth Rogen' }, { name: 'Sandra Oh' }, { name: 'Keanu Reeves' }], trailerUrl: 'https://www.youtube.com/embed/EuRwBSnO_wA' },
  { id: 10, title: 'The Craft (Jóvenes Brujas)', genre: 'Terror, Fantasía, Drama', duration: '1h 50min', classification: 'B-15', format: '3D', language: 'Inglés', releaseDate: '1996-10-31', image: 'https://statics.cinemex.com/movie_posters/2TlcLmfOGvBEMw8-360x540.jpg', sinopsis: 'Una recién llegada a una escuela católica entabla relación con un trío de adolescentes marginadas que practican brujería y evocan hechizos y maldiciones contra quienes las enfadan.', director: { name: 'Andrew Fleming' }, actors: [{ name: 'Robin Tunney' }, { name: 'Fairuza Balk' }, { name: 'Neve Campbell' }], trailerUrl: 'https://www.youtube.com/embed/SxEqB--5ToI' },
  { id: 11, title: 'No Me Sigas', genre: 'Terror, Suspenso', duration: '1h 29min', classification: 'B-15', format: 'Tradicional', language: 'Español', releaseDate: '2025-11-07', image: 'https://statics.cinemex.com/movie_posters/p6DTADwW29raQN7-360x540.jpg', sinopsis: 'Carla, una joven desesperada por pertenecer socialmente, intenta destacar en el mundo digital. Para aumentar sus seguidores, se muda a un famoso edificio embrujado. Comienza a fingir apariciones fantasmales, pero pronto invoca una verdadera entidad maligna que se apodera de su vida hasta que nadie sabrá distinguir entre lo real y lo falso.', director: { name: 'Ximena García Lecuona' }, actors: [{ name: 'Yankel Stevan' }, { name: ' Karla Coronado' }, { name: 'Julia Maqueo' }], trailerUrl: 'https://www.youtube.com/embed/SFYeLyqis_o' },
  { id: 12, title: '6 Exorcismos', genre: 'Terror', duration: '1h 44min', classification: 'B-15', format: 'Tradicional', language: 'Español', releaseDate: '2025-10-17', image: 'https://statics.cinemex.com/movie_posters/jSom2HZDQ30awWZ-360x540.jpg', sinopsis: 'La joven reportera Si-kyung se infiltra en un culto religioso secreto. Lo que comienza como una investigación encubierta pronto se convierte en una pesadilla indescriptible, cuando es invitada a presenciar un ritual prohibido en el que cada miembro pide un deseo y ofrece un sacrificio. Uno a uno, los fieles narran la aterradora historia de cómo lo consiguieron… cada relato es más escalofriante y sangriento que el anterior. Cuando llega el turno de Si-kyung, descubre con horror que todos los sacrificios deben ser partes del cuerpo humano. Esas ofrendas no son simples pruebas de fe, sino piezas de un plan macabro: dar vida a una entidad ancestral, un ser que aguarda en las sombras para reclamar la carne y el alma de todos los presentes. El ritual ha comenzado… y con él, el despertar del mal absoluto.', director: { name: 'Won-kyung Choe' }, actors: [{ name: 'Kim Chae-eun' }, { name: 'Kim Min-seok' }, { name: 'Kwon Ah Reum' }], trailerUrl: 'https://www.youtube.com/embed/pC5NSEsMNb8' }
]

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
      showSuccessModal: false,
      showWarningModal: false,
      showProductModal: false,
      showDeleteConfirm: false,
      showTrailerModal: false,
      isEditing: false,
      form: {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
        weight: '',
        dimensions: '',
        color: '',
        material: '',
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
    }
  },
  mounted () {
    this.fetchProduct()
    this.checkAdmin()
    this.fetchRelatedProducts()
  },
  methods: {
    fetchRelatedProducts () {
      const all = allMovies.filter(p => p.id !== this.movie?.id)
      this.relatedProducts = all.sort(() => 0.5 - Math.random()).slice(0, 4)
        .map(movie => ({ ...movie, name: movie.title }))
    },
    fetchProduct () {
      const id = parseInt(this.$route.params.id)
      const foundMovie = allMovies.find(m => m.id === id)
      if (foundMovie) {
        this.movie = {
          ...foundMovie,
          name: foundMovie.title,
          description: foundMovie.sinopsis
        }
        this.currentImage = this.movie.image
      } else {
        this.movie = null
      }
    },
    increaseQty () {
      this.quantity++
    },
    decreaseQty () {
      if (this.quantity > 1) { this.quantity-- }
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
      if (confirm('Are you sure you want to delete this product?')) {
        axios.delete(`http://localhost:5020/api/products/delete/${this.movie.id}`)
          .then(() => {
            alert('Product deleted successfully.')
            this.$router.push('/shop')
          })
          .catch((_err) => {
          })
      }
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
      if (!name) { return 'SKU-00000' }
      const base = name.replace(/\s+/g, '').substring(0, 3).toUpperCase()
      const random = Math.floor(1000 + Math.random() * 9000)
      return `SKU-${base}${random}`
    },
    generateTags (desc) {
      if (!desc || typeof desc !== 'string') { return ['general'] }
      const words = desc.split(/\W+/).filter(w => w.length > 4)
      return [...new Set(words.slice(0, 3).map(w => w.toLowerCase()))]
    },
    openEditModal () {
      this.isEditing = true
      this.form = {
        name: this.movie.title || '',
        description: this.movie.sinopsis || '',
        price: this.movie.price || '',
        stock: this.movie.stock || '',
        category: this.movie.genre || '',
        brand: this.movie.brand || '',
        weight: this.movie.weight || '',
        dimensions: this.movie.dimensions || '',
        color: this.movie.color || '',
        material: this.movie.material || '',
        image: this.movie.image || ''
      }
      this.showProductModal = true
    },
    openAddModal () {
      this.isEditing = false
      this.form = {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
        weight: '',
        dimensions: '',
        color: '',
        material: '',
        image: ''
      }
      this.showProductModal = true
    },
    submitProduct () {
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

html, body, #__nuxt, #__layout, .v-application, .v-main {
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
