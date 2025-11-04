<template>
  <v-app>
    <PageHeader />
    <v-main>
      <!-- Hero Section -->
      <ProductImage title="Blog" />
      <!-- Main Content -->
      <main class="main-content">
        <!-- Blog Posts -->
        <section class="blog-posts">
          <!-- Post 1 -->
          <article class="blog-post">
            <img src="../public/images/12_Blog.jpg" alt="Millennial Design" class="post-image">
            <div class="post-content">
              <div class="post-meta">
                <div class="post-author">
                  <div class="author-avatar" />
                  <span>Ryan</span>
                </div>
                <span>14 Oct 2022</span>
                <span>Wood</span>
              </div>
              <h2 class="post-title">
                Going all-in with millennial design
              </h2>
              <p class="post-excerpt">
                Millennial furniture design embraces a blend of simplicity, comfort, and eco-consciousness. With clean lines, muted tones, and natural materials, each piece is crafted to create inviting, functional spaces that reflect a modern lifestyle. It’s all about cozy elegance with a sustainable twist.
              </p>
              <a href="#" class="read-more">Read more</a>
            </div>
          </article>

          <!-- Post 2 -->
          <article class="blog-post">
            <img src="../public/images/13_Blog.jpg" alt="Decorating" class="post-image">
            <div class="post-content">
              <div class="post-meta">
                <div class="post-author">
                  <div class="author-avatar" />
                  <span>Ryan</span>
                </div>
                <span>14 Oct 2022</span>
                <span>Handmade</span>
              </div>
              <h2 class="post-title">
                Exploring new ways of decorating
              </h2>
              <p class="post-excerpt">
                Discover fresh approaches to home decor with a focus on handmade details and personal expression. From artisanal accents to bold, creative layouts, decorating becomes a journey of turning ordinary spaces into meaningful reflections of who you are.
              </p>
              <a href="#" class="read-more">Read more</a>
            </div>
          </article>

          <!-- Post 3 -->
          <article class="blog-post">
            <img src="../public/images/14_Blog.jpg" alt="Handmade Pieces" class="post-image">
            <div class="post-content">
              <div class="post-meta">
                <div class="post-author">
                  <div class="author-avatar" />
                  <span>Ryan</span>
                </div>
                <span>14 Oct 2022</span>
                <span>Wood</span>
              </div>
              <h2 class="post-title">
                Handmade pieces that took time to make
              </h2>
              <p class="post-excerpt">
                Crafted with patience and passion, these handmade wooden pieces celebrate the beauty of slow design. Every detail reflects the artisan’s touch, turning everyday objects into timeless treasures filled with character and soul.
              </p>
              <a href="#" class="read-more">Read more</a>
            </div>
          </article>
        </section>

        <!-- Sidebar -->
        <aside class="sidebar">
          <!-- Search -->
          <div class="sidebar-section">
            <div class="search-box">
              <input type="text" class="search-input" placeholder="Search...">
              <v-btn icon class="search-btn">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Categories -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              Categories
            </h3>
            <ul class="category-list">
              <li class="category-item">
                <a href="#" class="category-link">Crafts</a>
                <span class="category-count">5</span>
              </li>
              <li class="category-item">
                <a href="#" class="category-link">Design</a>
                <span class="category-count">8</span>
              </li>
              <li class="category-item">
                <a href="#" class="category-link">Handmade</a>
                <span class="category-count">7</span>
              </li>
              <li class="category-item">
                <a href="#" class="category-link">Interior</a>
                <span class="category-count">1</span>
              </li>
              <li class="category-item">
                <a href="#" class="category-link">Wood</a>
                <span class="category-count">6</span>
              </li>
            </ul>
          </div>

          <!-- Recent Posts -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              Recent Posts
            </h3>
            <div class="recent-post">
              <img src="../public/images/12_Blog.jpg" alt="Recent Post" class="recent-post-image">
              <div class="recent-post-content">
                <a href="#" class="recent-post-title">Going all-in with millennial design</a>
                <div class="recent-post-date">
                  6 Sep 2024
                </div>
              </div>
            </div>
            <div class="recent-post">
              <img src="../public/images/13_Blog.jpg" alt="Recent Post" class="recent-post-image">
              <div class="recent-post-content">
                <a href="#" class="recent-post-title">Exploring new ways of decorating</a>
                <div class="recent-post-date">
                  10 Jun 2024
                </div>
              </div>
            </div>
            <div class="recent-post">
              <img src="../public/images/14_Blog.jpg" alt="Recent Post" class="recent-post-image">
              <div class="recent-post-content">
                <a href="#" class="recent-post-title">Handmade pieces that took time to make</a>
                <div class="recent-post-date">
                  14 May 2025
                </div>
              </div>
            </div>
            <div class="recent-post">
              <img src="../public/images/11_Blog.jpg" alt="Recent Post" class="recent-post-image">
              <div class="recent-post-content">
                <a href="#" class="recent-post-title">Modern home in Milan</a>
                <div class="recent-post-date">
                  16 Dic 2024
                </div>
              </div>
            </div>
            <div class="recent-post">
              <img src="../public/images/15_Blog.jpg" alt="Recent Post" class="recent-post-image">
              <div class="recent-post-content">
                <a href="#" class="recent-post-title">Colorful office redesign</a>
                <div class="recent-post-date">
                  03 Aug 2024
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
      <RoseSection />
      <PageFooter />
    </v-main>
  </v-app>
</template>

<script>
import PageHeader from '~/components/PageHeader.vue'
import ProductImage from '~/components/ProductImage.vue'
import PageFooter from '~/components/PageFooter.vue'
import RoseSection from '~/components/RoseSection.vue'

export default {
  components: {
    PageFooter,
    RoseSection,
    ProductImage,
    PageHeader
  }
}
</script>

<style scoped>
/* Estilos generales */
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
/* Estructura de reseñas destacadas */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

/* Reseñas destacadas */
.featured-reviews {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.review-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.review-card:hover {
  transform: translateY(-5px);
}

.review-card.featured {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: row;
}

.review-card.featured .product-image {
  width: 40%;
  height: auto;
  object-fit: cover;
}

.review-card.featured .review-content {
  width: 60%;
  padding: 2rem;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.rating-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
}

.review-content {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.review-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.review-excerpt {
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.rating {
  color: #FFC107;
  margin-bottom: 0.5rem;
}

/* Categorías */
.categories-section {
  padding: 4rem 2rem;
  background: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.category-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 2rem 1rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.category-card:hover {
  background: #e0e0e0;
  transform: translateY(-5px);
}

.category-card h3 {
  margin: 1rem 0 0.5rem;
  color: #333;
}

.category-card p {
  color: #666;
  font-size: 0.9rem;
}

/* Últimas reseñas */
.latest-reviews {
  padding: 4rem 2rem;
  background: #f9f9f9;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-item {
  display: flex;
  gap: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.review-thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.review-details {
  flex: 1;
}

.review-summary {
  color: #555;
  margin-top: 0.5rem;
  line-height: 1.5;
}
/* Footer instagram */
.instagram-section {
    height: 50vh;
    width: 100vw;
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

  /* Main Content */
        .main-content {
            display: flex;
            max-width: 1200px;
            margin: 2rem auto;
            gap: 2rem;
            padding: 0 2rem;
        }

        .blog-posts {
            flex: 2;
        }

        .sidebar {
            flex: 1;
            max-width: 300px;
        }

        /* Blog Post Styles */
        .blog-post {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            cursor: pointer;
            transition: box-shadow 0.3s;
        }

        .blog-post:hover {
            box-shadow: 0 8px 20px rgba(0,0,0,0.30);
        }

        .post-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }

        .post-content {
            padding: 1.5rem;
        }

        .post-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #666;
        }

        .post-author {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .author-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-image: url('../public/images/16_ProfilePic.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        .post-title {
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #333;
            line-height: 1.3;
        }

        .post-excerpt {
            color: #666;
            margin-bottom: 1rem;
            line-height: 1.6;
        }

        .read-more {
            color: #8B4513;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            transition: color 0.3s;
        }

        .read-more:hover {
            color: #654321;
            text-decoration: underline;
        }

        /* Sidebar Styles */
        .sidebar-section {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .sidebar-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #333;
        }

        /* Categories */
        .category-list {
            list-style: none;
        }

        .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .category-item:last-child {
            border-bottom: none;
        }

        .category-link {
            text-decoration: none;
            color: #666;
            transition: color 0.3s;
        }

        .category-link:hover {
            color: #8B4513;
        }

        .category-count {
            background-color: #f5f5f5;
            color: #666;
            font-size: 0.8rem;
            padding: 0.2rem 0.5rem;
            border-radius: 12px;
        }

        /* Recent Posts */
        .recent-post {
            display: flex;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .recent-post:last-child {
            border-bottom: none;
        }

        .recent-post-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
            flex-shrink: 0;
        }

        .recent-post-content {
            flex: 1;
        }

        .recent-post-title {
            font-size: 0.9rem;
            font-weight: 500;
            color: #333;
            text-decoration: none;
            line-height: 1.3;
            display: block;
            margin-bottom: 0.3rem;
        }

        .recent-post-title:hover {
            color: #8B4513;
        }

        .recent-post-date {
            font-size: 0.8rem;
            color: #999;
        }

        /* Search Box */
        .search-box {
            position: relative;
            margin-bottom: 1rem;
        }

        .search-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #f0f0f0;
            border-radius: 25px;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.3s;
        }

        .search-input:focus {
            border-color: #8B4513;
        }

        .search-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .main-content {
                flex-direction: column;
                padding: 0 1rem;
            }

            .sidebar {
                max-width: none;
            }

            .nav-links {
                display: none;
            }

            .header-container {
                padding: 0 1rem;
            }

            .post-title {
                font-size: 1.2rem;
            }
        }
</style>
