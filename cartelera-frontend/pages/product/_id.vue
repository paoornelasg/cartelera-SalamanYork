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

/* const allMovies = [
  { id: 8, title: 'Amor Fuera de Tiempo', genre: 'Romance, Drama, Fantasía', duration: '1h 39min', classification: 'B', format: 'Tradicional', language: 'Inglés', releaseDate: '2025-10-10', image: 'https://tickets-static-content.cinepolis.com/pimcore/9618/assets/Mexico/Tickets/Movies/AmorFueraDeTiempo/Es/Poster_720x1022_copia_2_/resource.jpg', sinopsis: 'Dallas, una estudiante determinada que sueña con entrar a la mejor escuela de danza del país, se cruza con Drayton, el mariscal de campo estrella que duda sobre su futuro. La química entre ellos es innegable, pero sus ambiciones opuestas ponen a prueba si el amor puede superar sus diferencias.', director: { name: 'Justin Wu' }, actors: [{ name: 'Siena Agudong' }, { name: 'Noah Beck' }, { name: 'Drew Ray Tanner' }], trailerUrl: 'https://www.youtube.com/embed/-3itEzH1-EI' },
  { id: 9, title: 'Cuando El Cielo Se Equivoca', genre: 'Comedia, Drama', duration: '1h 38min', classification: 'B', format: 'Tradicional', language: 'Español', releaseDate: '2025-10-31', image: 'https://statics.cinemex.com/movie_posters/SMuqdJXLQnRahiI-360x540.jpg', sinopsis: 'Cuando Gabriel (Keanu Reeves) un ángel guardián bien intencionado pero inepto interviene en la vida Arj (Aziz Ansari) -un desempleado que vive en su coche- intercambiando su vida con la del adinerado Jeff (Seth Rogen) descubre que la buena fortuna trae problemas en esta comedia social de enredos celestiales y tacos al pastor.​​ Gabriel desea demostrarle a Arj que la riqueza no arregla todos sus problemas…¿o sí?', director: { name: 'Aziz Ansari' }, actors: [{ name: 'Seth Rogen' }, { name: 'Sandra Oh' }, { name: 'Keanu Reeves' }], trailerUrl: 'https://www.youtube.com/embed/EuRwBSnO_wA' },
  { id: 10, title: 'The Craft (Jóvenes Brujas)', genre: 'Terror, Fantasía, Drama', duration: '1h 50min', classification: 'B-15', format: '3D', language: 'Inglés', releaseDate: '1996-10-31', image: 'https://statics.cinemex.com/movie_posters/2TlcLmfOGvBEMw8-360x540.jpg', sinopsis: 'Una recién llegada a una escuela católica entabla relación con un trío de adolescentes marginadas que practican brujería y evocan hechizos y maldiciones contra quienes las enfadan.', director: { name: 'Andrew Fleming' }, actors: [{ name: 'Robin Tunney' }, { name: 'Fairuza Balk' }, { name: 'Neve Campbell' }], trailerUrl: 'https://www.youtube.com/embed/SxEqB--5ToI' },
  { id: 11, title: 'No Me Sigas', genre: 'Terror, Suspenso', duration: '1h 29min', classification: 'B-15', format: 'Tradicional', language: 'Español', releaseDate: '2025-11-07', image: 'https://statics.cinemex.com/movie_posters/p6DTADwW29raQN7-360x540.jpg', sinopsis: 'Carla, una joven desesperada por pertenecer socialmente, intenta destacar en el mundo digital. Para aumentar sus seguidores, se muda a un famoso edificio embrujado. Comienza a fingir apariciones fantasmales, pero pronto invoca una verdadera entidad maligna que se apodera de su vida hasta que nadie sabrá distinguir entre lo real y lo falso.', director: { name: 'Ximena García Lecuona' }, actors: [{ name: 'Yankel Stevan' }, { name: ' Karla Coronado' }, { name: 'Julia Maqueo' }], trailerUrl: 'https://www.youtube.com/embed/SFYeLyqis_o' },
  { id: 12, title: '6 Exorcismos', genre: 'Terror', duration: '1h 44min', classification: 'B-15', format: 'Tradicional', language: 'Español', releaseDate: '2025-10-17', image: 'https://statics.cinemex.com/movie_posters/jSom2HZDQ30awWZ-360x540.jpg', sinopsis: 'La joven reportera Si-kyung se infiltra en un culto religioso secreto. Lo que comienza como una investigación encubierta pronto se convierte en una pesadilla indescriptible, cuando es invitada a presenciar un ritual prohibido en el que cada miembro pide un deseo y ofrece un sacrificio. Uno a uno, los fieles narran la aterradora historia de cómo lo consiguieron… cada relato es más escalofriante y sangriento que el anterior. Cuando llega el turno de Si-kyung, descubre con horror que todos los sacrificios deben ser partes del cuerpo humano. Esas ofrendas no son simples pruebas de fe, sino piezas de un plan macabro: dar vida a una entidad ancestral, un ser que aguarda en las sombras para reclamar la carne y el alma de todos los presentes. El ritual ha comenzado… y con él, el despertar del mal absoluto.', director: { name: 'Won-kyung Choe' }, actors: [{ name: 'Kim Chae-eun' }, { name: 'Kim Min-seok' }, { name: 'Kwon Ah Reum' }], trailerUrl: 'https://www.youtube.com/embed/pC5NSEsMNb8' }
] */

export default {
  components: {
    AppHeader,
    PageFooter
  },
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
