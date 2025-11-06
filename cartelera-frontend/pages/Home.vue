<template>
  <v-app>
    <v-app-bar app class="text-black nav-transparent" elevation="0">
      <!-- NavBAr-->
      <v-app-bar-nav-icon
        class="d-sm-none"
        @click="drawer = !drawer"
      />
      <div class="main-header-container">
        <div class="logo-container">
          ㅤ
        </div>

        <div class="header-buttons-container d-none d-sm-flex">
          <NuxtLink to="/Home" class="header-button">
            Inicio
          </NuxtLink>
          <NuxtLink to="/shop" class="header-button">
            Cartelera
          </NuxtLink>
          <NuxtLink to="/about" class="header-button">
            Acerca
          </NuxtLink>
          <NuxtLink to="/contact" class="header-button">
            Contacto
          </NuxtLink>
        </div>

        <div class="header-icons-container">
          <v-btn icon @click="$router.push('/ultimateLogin')">
            <v-icon color="black">
              mdi-account-alert-outline
            </v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon color="black">
              mdi-magnify
            </v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon color="black">
              mdi-heart-outline
            </v-icon>
          </v-btn>
          <CartModal :is-open="showCart" @update:isOpen="showCart = $event" />
          <v-btn icon @click="showCart = true">
            <v-icon color="black">
              mdi-cart-outline
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-app-bar> <!-- Fin NavBAr-->

    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      class="d-sm-none"
    >
      <v-list dense>
        <v-list-item link to="/Home">
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/shop">
          <v-list-item-title>Cartelera</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/about">
          <v-list-item-title>Acerca</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/contact">
          <v-list-item-title>Contacto</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <!-- Primera Seccion-->
      <div class="main-section">
        <div class="main-section-content">
          <div class="main-section-text">
            <h1 class="main-section-title">
              Cartelera · Estrenos
            </h1>
            <p class="main-section-subtitle">
              Las mejores películas y estrenos disponibles ahora
            </p>
            <div class="main-section-buttons">
              <NuxtLink to="/shop" class="main-section-button">
                Cartelera
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Segunda Seccion-->
      <div class="top-picks-section">
        <div class="top-picks-section-header">
          <h2>Estrenos</h2>
          <p class="top-picks-section-text">
            Observa lo último en cartelera
          </p>
        </div>
        <div class="top-picks-section-furniture">
          <v-carousel
            height="350"
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
        </div>
      </div>
      <div class="new-arrivals-section">
        <div class="new-arrivals-main-furniture-container">
          <NuxtLink to="/shop">
            <img class="new-arrivals-furniture" src="../public/images/08_SofaWithBureau.png" alt="Sofa">
          </NuxtLink>
          <div class="new-arrivals-section-text">
            <h2 style="text-align: center;">
              New Arrivals
            </h2>
            <h1 class="main-section-title">
              Modern Sofa
            </h1>
            <button class="new-arrivals-section-button">
              Order Now
            </button>
          </div>
        </div>
      </div>
      <div class="instagram-section">
        <div class="instagram-section-content">
          <h1 class="instagram-title">
            Our Instagram
          </h1>
          <h3>
            Follow our account to see more furniture and decor
          </h3>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <button class="instagram-button">
              Follow Us on Instagram
            </button>
          </a>
        </div>
      </div>
      <PageFooter />
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import PageFooter from '~/components/PageFooter.vue'
import CartModal from '~/components/CartModal.vue'

export default {
  components: {
    PageFooter,
    CartModal
  },
  data () {
    return {
      drawer: false,
      productos: [],
      productoSeleccionado: {},
      showCart: false,

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
      ]
    }
  },
  mounted () {
    axios.get('http://localhost:5020/api/products')
      .then((res) => {
        // Ordena las peliculas de estreno y deja las primeras tres
        const todos = res.data
        this.productos = todos.slice(-3).reverse()
      })
      .catch(() => {
        // Si hay error al cargar productos, dejamos la lista vacía (evita uso de console.error por linter)
        this.productos = []
      })
  }
}
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    max-width: 100%;
    overflow-x: hidden;
    width: 100vw;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  a.furniture-name,
  a.blog-post-text {
    text-decoration: none !important;
    color: inherit !important;
  }

  .main-header-container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-evenly;
    align-items: center;
  }

  .logo-container {
    width: 25%;
    height: 100%;
  }

  .header-buttons-container {
    display: flex;
    height: 100%;
    gap: 40px;
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
  color: #ffffff;
  background-color: #a6a5a5;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.12);
}

  .header-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.18);
    text-decoration: none;
  }

  /* Estilos para los botones de iconos y acciones en la cabecera */
  .header-icons-container .v-btn {
    background-color: #a6a5a5 !important;
    color: black !important;
    border-radius: 8px !important;
    margin-left: 8px;
  }

  .header-icons-container .v-btn .v-icon {
    color: #ffffff !important;
  }

  /* Icono del drawer en pantallas pequeñas */
  .v-app-bar-nav-icon {
    background-color: #a6a5a5 !important;
    color: #ffffff !important;
    border-radius: 8px !important;
  }

  .main-section {
    display: flex;
    justify-content: flex-start; /* Texto en la izquierda */
    align-items: flex-end; /* Texto en la parte inferior */
    width: 100%;
    height: 60vh; /* un ajuste para que no sea cuadrado y pase a ser rectangular */
    background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.40)), url('../public/images/Imagen_de_Fondo.jpg') center/cover no-repeat;
    padding: 2rem; /* separación */
    box-sizing: border-box;
  }

  .main-section-content {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    width: 100%;
    max-width: 1200px;
  }

  .secondary-section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #faf4f4;
  }

  .top-picks-section {
    height: 70vh;
    width: 100%;
    background-color: white;
    padding: 2rem 1rem;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .blogs-section {
    height: auto;
    padding-bottom: 40px;
    width: 100%;
    background-color: white;
  }

  .new-arrivals-section {
    padding: 100px 0;
    height: auto;
    min-height: 700px;
    background-color: #fff9e6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-sofa {
    width: 80%;
    height: auto;
    max-width: 700px;
    object-fit: contain;
  }

  .main-section-title {
    font-weight: 500;
    font-size: clamp(1.5rem, 4vw, 3rem);
    color: #fff; /* texto claro sobre imagen */
    text-align: center;
    margin-top: 20px;
  }

  .main-section-text {
    color: white;
    display: flex;
    align-items: flex-start; /* Alinear a la izquierda */
    flex-direction: column;
    text-align: left;
    padding: 1rem;
    margin: 0;
  }

  .main-section-button {
    display: inline-block;
    font-weight: 600;
    font-size: clamp(1rem, 3vw, 1.25rem);
    color: #ebebeb;
    background: rgba(243, 95, 95, 0.95);
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .main-section-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.18);
  }

  .secondary-section-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 1 300px;
    max-width: 100%;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
  }

  .secondary-section-content img {
    max-width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }

  .secondary-table {
    width: 400px
  }

  .secondary-sofa {
    width: 400px;
  }

  .secondary-section-text {
    font-weight: 600;
    font-size: 1.8rem;
    color: black;
    text-align: center;
    margin: 10px 0;
  }

  .top-picks-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 40px 20px;
    margin: 0;
    overflow: visible !important;
    height: auto !important;
    box-sizing: border-box;
  }

  .top-picks-section h2 {
    font-weight: 500;
    font-size: 2rem;
    color: black;
    text-align: center;
    margin-top: 20px;
  }

  .top-picks-section-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 20%;
    /* border: 1px solid cadetblue; */
  }

  .top-picks-section-text {
    color: gray;
    margin-top: 0.5rem;
  }

  .top-picks-section-furniture {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 100px;
    width: 100%;
    /* border: 1px solid crimson; */
  }

  .top-picks-section-sub-furniture {
    flex: 1 1 250px;
    max-width: 300px;
    text-align: center;
    box-sizing: border-box;
  /*   border: 1px solid cadetblue; */
  }

  .sub-furniture {
    width: 100%;
    max-width: 420px;
    height: auto;
    object-fit: cover;
    margin-bottom: 10px;
    transition: transform 0.3s ease;
  }

  .furniture-name {
    font-size: 1.2rem;
    font-weight: 300;
    margin-top: 10px;
    margin-bottom: 4px;
    text-align: center;
    color: black;
  }

  .furniture-price {
    font-weight: 400;
    font-size: 1.5rem;
    margin-top: 5px;
    color: black;
  }

  .top-picks-view-more-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 20%;
  /*   border: 1px solid cadetblue; */
  }

  .new-arrivals-main-furniture-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 80px;
    padding: 0 5vw;
    flex-wrap: nowrap;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  /*   border: 1px solid cadetblue; */
  }

  .new-arrivals-furniture {
    flex: 0 0 auto;
    max-width: none;
    width: 100%;
    height: auto;
    transform: scale(1.25);
    margin-left: -40px;
    object-fit: contain;
  /*   border: 1px solid cadetblue; */
  }

  .new-arrivals-section-text {
    display: flex;
    flex: 0 0 35%;
    padding-left: 60px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 400px;
    width: 100%;
    text-align: center;
  /*   border: 1px solid salmon; */
  }

  .new-arrivals-section-button {
    background-color: transparent;
    border: 2px solid black;
    color: black;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-size: large;
    font-weight: 500;
    transition: all 0.3s ease-in-out;
  }

  .new-arrivals-section-button:hover {
    background-color: black;
    color: white;
  }

  .new-arrivals-section-text button {
    margin-top: 20px;
  }

  .blogs-section h2 {
    font-weight: 500;
    font-size: 2rem;
    color: black;
    text-align: center;
    margin-top: 20px;
  }

  .posts-container {
  /*   border: 1px solid cadetblue; */
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 40px;
    flex-wrap: wrap;
    padding: 0 20px;
  }

  .blog-post-container {
    max-width: 420px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 0 20px;
  /*   border: 1px solid crimson; */
  }

  .blog-image {
    width: 480px;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease-in-out;
  }

  .blog-image:hover {
    transform: scale(1.03);
  }

  .blog-post-text {
    font-weight: 500;
    font-size: clamp(1rem, 3vw, 1.3rem);
    color: black;
    text-align: center;
    margin-top: 15px;
  }

  .instagram-section {
    height: 50vh;
    width: 100%;
    background-color: #faf7f7;
  }

  .instagram-section-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .instagram-title {
    font-weight: 550;
    font-size: 3rem;
    color: black;
    text-align: center;
    margin-top: 20px;
    width: 100%;
  }

  .instagram-button {
    background-color: #faf4f4;
    border: none;
    color: black;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-size: large;
    font-weight: 500;
    margin-top: 40px;
    border-radius: 25px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    width: 300px;
  }

  .modal-image {
    max-width: 100%;
    margin: 10px 0;
  }

  .v-app {
    background-color: #fbebb5;
    overflow-x: hidden;
    width: 100vw;
    max-width: 100vw;
  }

  .v-main {
    padding: 0 !important;
    width: 100vw;
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* Diseño responsive */
  @media (max-width: 768px) {
    body, html, .v-main, .v-app {
      max-width: 100vw;
      overflow-x: hidden;
    }

    .main-section {
      flex-direction: column;
      height: auto;
      padding: 20px;
    }

    .main-section-content {
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .main-sofa {
      width: 90%;
      max-width: 320px;
      height: auto;
      object-fit: contain;
    }

    .main-section-title {
      font-size: 1.8rem;
      text-align: center;
    }

    .main-section-button {
      font-size: 1.2rem;
      padding: 10px 20px;
    }

    .secondary-section .main-section-button {
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }

    .header-buttons-container {
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 0;
    }

    .header-icons-container {
      justify-content: center;
      width: 100%;
      padding: 10px 0;
    }

    .secondary-section {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      gap: 20px;
      height: auto !important;
    }

    .secondary-section-content {
      width: 100%;
      max-width: 320px;
      text-align: center;
    }

    .secondary-table,
    .secondary-sofa {
      width: 100%;
      max-width: 300px;
      height: auto;
      object-fit: contain;
    }

    .top-picks-section {
      height: auto !important;
    }

    .top-picks-section-content {
      height: auto !important;
      text-align: center !important;
      padding: 0 15px;
    }

    .top-picks-section-furniture {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      padding: 20px 10px;
      height: auto;
    }

    .top-picks-section-sub-furniture {
      width: 90%;
      max-width: 300px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: auto;
    }

    .sub-furniture {
      width: 100%;
      height: auto;
      object-fit: contain;
      margin-bottom: 10px;
    }

    .furniture-name {
      margin-top: 10px;
      font-size: 1rem;
      font-weight: 500;
      color: black;
    }

    .furniture-price {
      font-size: 0.95rem;
      color: #333;
      margin-top: 4px;
    }

    .top-picks-view-more-container {
      height: auto;
      padding: 20px 0;
    }

    .top-picks-section-sub-furniture p,
    .secondary-section-content p {
      font-size: 1.5rem;
      font-weight: 600;
      color: black;
      margin-top: 10px;
      text-align: center;
    }

    .secondary-section .main-section-button {
      font-size: 0.85rem;
      padding: 0.4rem 0.8rem;
    }

    .new-arrivals-section {
      height: auto !important;
      padding: 30px 10px;
    }

    .new-arrivals-main-furniture-container {
      flex-direction: column !important;
      align-items: center;
      justify-content: center;
      height: auto !important;
      gap: 20px;
    }

    .new-arrivals-furniture {
      width: 90%;
      max-width: 300px;
      height: auto !important;
      object-fit: contain;
      margin-bottom: 10px;
    }

    .new-arrivals-section-text {
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: auto !important;
    }

    .new-arrivals-section-text h1 {
      font-size: clamp(1.4rem, 5vw, 2rem);
      margin: 10px 0;
    }

    .new-arrivals-section-text h2 {
      font-size: clamp(1.1rem, 4.5vw, 1.5rem);
      margin: 0;
    }

    .new-arrivals-section-button {
      font-size: 1rem;
      padding: 10px 20px;
      margin-top: 10px;
    }

    .blogs-section h2 {
      font-size: 1.5rem;
    }

    .blog-post-text {
      padding: 0 15px;
      font-size: 1rem;
    }

    .blog-image {
      border-radius: 12px;
      width: 95%;
      max-width: 360px;
      height: auto;
      object-fit: cover;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }

    .posts-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 30px;
      flex-wrap: wrap;
    }

    .blog-post-container {
      max-width: 300px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .instagram-section {
      height: auto !important;
      padding: 40px 20px;
      margin-top: 30px;
      background-color: #faf7f7;
      text-align: center;
      margin-bottom: 60px;
      padding-bottom: 40px;
      border-bottom: 1px solid #eee;
    }

    .instagram-title {
      font-size: 2rem !important;
      margin-bottom: 10px;
    }

    .instagram-section-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .instagram-section-content h3 {
      font-size: 1rem;
      line-height: 1.3;
      padding: 0 10px;
    }

    .instagram-button {
      font-size: 1rem;
      padding: 10px 20px;
      margin-top: 20px;
    }

    .modal-content {
      width: 90%;
      padding: 15px;
    }

    .v-navigation-drawer {
      max-width: 100%;
    }

    .page-footer {
      margin-top: 40px;
      padding-top: 40px;
      background-color: #f9f9f9;
      z-index: 0;
      position: relative;
    }
  }

  .instagram-section {
    margin-bottom: 0;
    padding-bottom: 40px;
    background-color: #faf7f7; /* asegúrate que este sea distinto del footer */
    position: relative;
    z-index: 1;
  }

  .instagram-button {
    margin-top: 20px;
  }

  .page-footer {
    background-color: #f2f2f2; /* cambia si quieres más contraste */
    padding: 40px 20px 20px;
    margin-top: 0;
    position: relative;
    z-index: 0;
  }

  /* NavBar transparente */
  .nav-transparent {
    background-color: transparent !important;
    box-shadow: none !important;
  }

  /* Botón para ver los horarios */
  .ver-horarios-button {
    background-color: #f63f3f;
    color: #000000;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.15s ease;
    margin-top: 8px;
  }

  .ver-horarios-button:hover {
    background-color: #f17e7e;
    color: black;
  }

  /* Estilos para los product-cards en Home (basados en shop.vue) */
  .product-card {
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    max-width: 300px;
    width: 100%;
    margin: auto;
    border-radius: 10px;
    box-shadow: none;
    border: 1px solid transparent;
  }

  .product-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  }

  .product-image {
    object-fit: cover;
    width: 100%;
  }

  .product-title {
    font-size: 1.05rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Carousel/content wrapper styles copied from shop.vue for consistency */
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
    background: rgba(0, 0, 0, 0.35);
    padding: 20px 0;
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
</style>

<style>
.v-application .container.fill-height.d-flex.justify-center.align-center {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
  background-color: transparent !important;
  border: none !important;
}
</style>
