<template>
  <v-app>
    <v-app-bar color="#fbebb5" app class="text-black" elevation="0">
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
            Home
          </NuxtLink>
          <NuxtLink to="/shop" class="header-button">
            Shop
          </NuxtLink>
          <NuxtLink to="/about" class="header-button">
            About
          </NuxtLink>
          <NuxtLink to="/contact" class="header-button">
            Contact
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
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      class="d-sm-none"
    >
      <v-list dense>
        <v-list-item link to="/Home">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/shop">
          <v-list-item-title>Shop</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/about">
          <v-list-item-title>About</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/contact">
          <v-list-item-title>Contact</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div class="main-section">
        <div class="main-section-content">
          <div class="main-section-text">
            <h1 class="main-section-title">
              Rocket single seater
            </h1>
            <NuxtLink to="/shop" class="main-section-button">
              Shop
            </NuxtLink>
          </div>
          <img class="main-sofa" src="../public/images/01_Sofa.png" alt="Sofa">
        </div>
      </div>
      <div class="secondary-section">
        <div class="secondary-section-content">
          <img class="secondary-table" src="../public/images/02_MiniTable.png" alt="Table">
          <p class="secondary-section-text">
            Side Table
          </p>
          <NuxtLink to="/shop" class="main-section-button">
            View More
          </NuxtLink>
        </div>
        <div class="secondary-section-content">
          <img class="secondary-sofa" src="../public/images/03_WhiteSofa.png" alt="Table">
          <p class="secondary-section-text">
            White Sofa
          </p>
          <NuxtLink to="/shop" class="main-section-button">
            View More
          </NuxtLink>
        </div>
      </div>
      <div class="top-picks-section">
        <div class="top-picks-section-content">
          <h2>
            Top Picks
          </h2>
          <p class="top-picks-section-text">
            We’ve selected our favorite furniture just for you — comfort, style, and quality all in one place.
          </p>
        </div>
        <div class="top-picks-section-furniture">
          <div
            v-for="producto in productos"
            :key="producto.id"
            class="top-picks-section-sub-furniture"
          >
            <NuxtLink :to="`/product/${producto.id}`">
              <img
                class="sub-furniture"
                :src="producto.image"
                :alt="producto.name"
                @click="abrirModal(producto)"
              >
            </NuxtLink>
            <NuxtLink :to="`/product/${producto.id}`" class="furniture-name">
              <p class="furniture-name" @click="abrirModal(producto)">
                {{ producto.name }}
              </p>
            </NuxtLink>
            <p class="furniture-price">
              $ {{ Number(producto.price || 0).toFixed(2) }}
            </p>
          </div>
        </div>
        <div class="top-picks-view-more-container">
          <NuxtLink to="/shop" class="main-section-button">
            View More
          </NuxtLink>
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
      <div class="blogs-section">
        <div class="top-picks-section-content">
          <h2>
            Our Blogs
          </h2>
          <p class="top-picks-section-text">
            Explore our articles and discover ideas, tips, and trends to transform your home with style.
          </p>
        </div>
        <div class="posts-container">
          <div class="blog-post-container">
            <NuxtLink to="/Blog">
              <img class="blog-image" src="../public/images/09_Blog.jpg" alt="Blog">
            </NuxtLink>
            <NuxtLink to="/Blog" class="blog-post-text">
              Take Advantage of Our Offers
            </NuxtLink>
            <NuxtLink to="/Blog" class="main-section-button">
              Read More
            </NuxtLink>
          </div>
          <div class="blog-post-container">
            <NuxtLink to="/Blog">
              <img class="blog-image" src="../public/images/10_Blog.jpg" alt="Blog">
            </NuxtLink>
            <NuxtLink to="/Blog" class="blog-post-text">
              Learn More About Us
            </NuxtLink>
            <NuxtLink to="/Blog" class="main-section-button">
              Read More
            </NuxtLink>
          </div>
          <div class="blog-post-container">
            <NuxtLink to="/Blog">
              <img class="blog-image" src="../public/images/11_Blog.jpg" alt="Blog">
            </NuxtLink>
            <NuxtLink to="/Blog" class="blog-post-text">
              Discover the Latest Furniture Trends
            </NuxtLink>
            <NuxtLink to="/Blog" class="main-section-button">
              Read More
            </NuxtLink>
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
      showCart: false
    }
  },
  mounted () {
    axios.get('http://localhost:5020/api/products')
      .then((res) => {
        // Odena los productos más nuevos y deja los primeros tres
        const todos = res.data
        this.productos = todos.slice(-4).reverse()
      })
      .catch((err) => {
        console.error('Error loading products:', err)
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
  color: black;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

  .header-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    text-decoration: none;
  }

  .main-section {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #fbebb5;
    padding: 0 5vw;
    box-sizing: border-box;
  }

  .main-section-content {
    display: flex;
    justify-content: center;
    align-items: center;
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
    color: black;
    text-align: center;
    margin-top: 20px;
  }

  .main-section-text {
    color: black;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .main-section-button {
    font-weight: 500;
    font-size: clamp(1rem, 3vw, 1.5rem);
    color: black;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
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
</style>

<style>
.v-application .container.fill-height.d-flex.justify-center.align-center {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
  background-color: transparent !important;
  border: none !important;
}
</style>
