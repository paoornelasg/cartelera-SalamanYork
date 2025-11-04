<template>
  <v-app>
    <PageHeader />
    <!-- Main Content -->
    <v-main>
      <ProductImage title="About" />

      <!-- History Section -->
      <v-container class="about-container">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="about-card" elevation="0">
              <v-card-title class="about-title">
                <v-icon large color="amber-darken-3" class="mr-3">
                  mdi-home-heart
                </v-icon>
                Our Story
              </v-card-title>

              <v-card-text class="about-text">
                <p class="highlight-text">
                  Founded in 2025, the company was established by Paola Ornelas, Karlos Flores, and Jose Angel, with a shared vision of honoring traditional craftsmanship and adapting it to contemporary living spaces.
                </p>

                <p>
                  Born from a deep appreciation for timeless design and fine craftsmanship, this project blends tradition and innovation to create furniture pieces that elevate everyday living with character and durability.
                </p>

                <v-divider class="my-5" />

                <div class="mission-vision">
                  <div class="mission">
                    <h3>
                      <v-icon color="amber-darken-3">
                        mdi-bullseye-arrow
                      </v-icon>ㅤMission
                    </h3>
                    <p>Design functional and elegant furniture that reflects cultural richness, crafted with sustainable materials and guided by ethical processes.</p>
                  </div>

                  <div class="vision">
                    <h3>
                      <v-icon color="amber-darken-3">
                        mdi-eye-outline
                      </v-icon>ㅤVision
                    </h3>
                    <p>To become a benchmark in artisanal furniture design by 2030, recognized internationally for our quality, innovation, and timeless craftsmanship.</p>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Values Section -->
        <v-row justify="center" class="mt-10">
          <v-col cols="12">
            <h2 class="section-title text-center mb-6">
              Our Values
            </h2>

            <v-row>
              <v-col v-for="(value, i) in values" :key="i" cols="12" sm="6" md="3">
                <v-card class="value-card" elevation="0">
                  <v-icon x-large color="amber-darken-3" class="value-icon">
                    {{ value.icon }}
                  </v-icon>
                  <v-card-title class="value-title">
                    {{ value.title }}
                  </v-card-title>
                  <v-card-text class="value-text">
                    {{ value.text }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <RoseSection />
      <PageFooter />
    </v-main>
  </v-app>
</template>

<script>
import PageHeader from '~/components/PageHeader.vue'
import ProductImage from '~/components/ProductImage.vue'
import RoseSection from '~/components/RoseSection.vue'
import PageFooter from '~/components/PageFooter.vue'

export default {
  components: {
    ProductImage,
    RoseSection,
    PageFooter,
    PageHeader
  },
  data () {
    return {
      values: [
        {
          icon: 'mdi-hand-heart',
          title: 'Craftsmanship',
          text: 'Each piece is created with traditional techniques by master carpenters.'
        },
        {
          icon: 'mdi-leaf',
          title: 'Sustainability',
          text: 'We use certified wood and eco-friendly processes.'
        },
        {
          icon: 'mdi-account-group',
          title: 'Community',
          text: 'We support local artisans and family workshops.'
        },
        {
          icon: 'mdi-star',
          title: 'Quality',
          text: '5-year warranty on all our products.'
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Inherited header styles */
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
  transition: all 0.3s ease;
}

/* General styles */
.about-container {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Main card */
.about-card {
  border-radius: 0;
  overflow: hidden;
  transition: transform 0.3s ease;
  box-shadow: none !important;
}

.about-card:hover {
  transform: translateY(-5px);
}

.about-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  padding: 30px 30px 0;
  display: flex;
  align-items: center;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  padding: 30px;
}

.highlight-text {
  font-size: 1.3rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 20px;
}

/* Mission and Vision */
.mission-vision {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;
}

.mission, .vision {
  background: #fff9f0;
  padding: 20px;
  border-radius: 0;
  border-left: none;
}

.mission h3, .vision h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

/* Values */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: #fff4e4;
  margin: 15px auto 0;
}

.value-card {
  height: 100%;
  text-align: center;
  padding: 30px 20px;
  transition: all 0.3s ease;
  box-shadow: none !important;
}

.value-card:hover {
  transform: translateY(-5px);
}

.value-icon {
  margin-bottom: 15px;
}

.value-title {
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.value-text {
  font-size: 1rem;
  color: #666;
}

/* Responsive */
@media (max-width: 960px) {
  .about-container {
    padding: 60px 20px;
  }

  .mission-vision {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .about-title {
    font-size: 1.8rem;
    padding: 20px 20px 0;
  }

  .about-text {
    padding: 20px;
    font-size: 1rem;
  }

  .highlight-text {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 1.6rem;
  }
}
</style>
