<template>
  <v-app>
    <PageHeader />
    <v-main>
      <ProductImage title="Sobre Nosotros" />

      <v-container class="hero-section">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <div class="hero-content">
              <h1 class="hero-title">
                <v-icon x-large color="#dc143b" class="mr-3">
                  mdi-movie-star
                </v-icon>
                Conoce Nuestro Equipo
              </h1>
              <p class="hero-subtitle">
                Somos 6 profesionales apasionados comprometidos con brindarte la mejor experiencia cinematográfica.
                Cada uno de nosotros aporta su talento y dedicación para hacer de cada visita un momento inolvidable.
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="team-container">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="9">
            <v-row>
              <v-col
                v-for="(member, i) in teamMembers"
                :key="i"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card class="team-card" elevation="2">
                  <div class="card-header">
                    <div class="avatar-wrapper">
                      <v-avatar size="120" color="grey lighten-2" class="team-avatar">
                        <v-img
                          :src="member.image"
                          :alt="member.name"
                          cover
                        />
                      </v-avatar>
                    </div>
                  </div>

                  <v-card-title class="team-name">
                    {{ member.name }}
                  </v-card-title>

                  <v-card-subtitle class="team-role">
                    <v-icon small color="#dc143b" class="mr-1">
                      mdi-badge-account-horizontal
                    </v-icon>
                    {{ member.role }}
                  </v-card-subtitle>

                  <v-divider class="mx-4" />

                  <v-card-text class="team-bio">
                    {{ member.bio }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="mission-section">
        <v-row justify="center">
          <v-col cols="12" md="10">
            <h2 class="section-title text-center">
              <v-icon large color="#dc143b" class="mr-2">
                mdi-flag-variant
              </v-icon>
              Nuestra Misión y Valores
            </h2>
          </v-col>
        </v-row>

        <v-row justify="center" class="mt-8">
          <v-col cols="12" md="5">
            <v-card class="mission-card" elevation="0">
              <div class="mission-icon-wrapper">
                <v-icon size="50" color="#dc143b">
                  mdi-bullseye-arrow
                </v-icon>
              </div>
              <v-card-title class="mission-card-title">
                Misión
              </v-card-title>
              <v-card-text class="mission-card-text">
                Ofrecer experiencias cinematográficas excepcionales que combinen entretenimiento de alta calidad,
                tecnología de vanguardia y un servicio cálido y personalizado. Nos dedicamos a crear
                momentos memorables para cada espectador, promoviendo la cultura del cine de manera accesible e innovadora.
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card class="mission-card" elevation="0">
              <div class="mission-icon-wrapper">
                <v-icon size="50" color="#dc143b">
                  mdi-eye-outline
                </v-icon>
              </div>
              <v-card-title class="mission-card-title">
                Visión
              </v-card-title>
              <v-card-text class="mission-card-text">
                Consolidarnos como el cine líder en innovación y experiencia audiovisual en nuestra región,
                reconocidos por la excelencia de nuestros servicios, tecnología de última generación y nuestro
                compromiso inquebrantable de brindar momentos inolvidables a cada visitante.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="center" class="mt-12">
          <v-col cols="12" md="10">
            <h3 class="values-title text-center mb-8">
              Nuestros Valores Fundamentales
            </h3>
          </v-col>

          <v-col v-for="(value, i) in values" :key="i" cols="12" sm="6" md="3">
            <v-card class="value-card" elevation="0">
              <div class="value-icon-container">
                <v-icon large color="white">
                  {{ value.icon }}
                </v-icon>
              </div>
              <v-card-title class="value-title">
                {{ value.title }}
              </v-card-title>
              <v-card-text class="value-text">
                {{ value.text }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="stats-section">
        <v-row justify="center">
          <v-col v-for="(stat, i) in stats" :key="i" cols="6" md="3">
            <div class="stat-card">
              <v-icon x-large color="#dc143b" class="stat-icon">
                {{ stat.icon }}
              </v-icon>
              <div class="stat-number">
                {{ stat.number }}
              </div>
              <div class="stat-label">
                {{ stat.label }}
              </div>
            </div>
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
      teamMembers: [
        {
          name: 'Paola Itzel Ornelas Galván',
          role: 'Backend Developer & Product Owner',
          bio: 'Soy estudiante de Ingeniería en Sistemas Computacionales y me gusta el desarrollo backend porque disfruto entender cómo funcionan las cosas. Soy curiosa y detallista, y siempre busco aprender algo nuevo o mejorar lo que ya hago. Me gustan los perritos, viajar, conocer lugares y meterme a proyectos que me permitan aprender y me ayuden a crecer',
          image: '/images/team/paola.jpg'
        },
        {
          name: 'Karlos Demian Flores Pineda',
          role: 'Frontend Developer',
          bio: 'Me gusta el desarrollo frontend y la creación de experiencias visuales bien cuidadas, trabajando con HTML y CSS para dar vida a interfaces limpias y funcionales. También exploro Linux, seguridad informática y herramientas de red en Python, áreas que me permiten entender a profundidad cómo se comunica y opera la tecnología. Además, disfruto trabajar con Unreal Engine 5 y proyectos creativos donde puedo combinar diseño, técnica y una visión moderna de lo digital.',
          image: '/images/team/karlos.jpg'
        },
        {
          name: 'Pedro Angel López Vargas',
          role: 'Frontend Developer',
          bio: 'Estudio Ingeniería en Sistemas y me inclino más por el desarrollo frontend. Me encanta crear interfaces limpias, intuitivas y visuales que hagan que la experiencia del usuario sea agradable. Me motiva convertir ideas en pantallas que se sientan vivas y bien construidas.',
          image: '/images/team/pedro.jpg'
        },
        {
          name: 'Jonatan Uriel Herrera González',
          role: 'Backend Developer',
          bio: 'Soy estudiante de Ingeniería en Sistemas Computacionales y me apasiona el backend. Me gusta resolver problemas complejos, diseñar arquitecturas eficientes y entender cómo fluyen los datos detrás de una aplicación. Disfruto cuando todo encaja de forma elegante y funciona como debería.',
          image: '/images/team/jonatan.jpg'
        },
        {
          name: 'Daniel Díaz Medina',
          role: 'Backend Developer',
          bio: 'Me enfoco en backend, especialmente en optimización y diseño de APIs. Me gusta entender el corazón de una aplicación, escribir código limpio y pensar en escalabilidad. Lo disfruto porque me reta y me obliga a mejorar constantemente.',
          image: '/images/team/daniel.jpg'
        },
        {
          name: 'Guillermo Gutiérrez Alvarez',
          role: 'Frontend Developer & SCRUM Master',
          bio: 'Me llama mucho la atención el desarrollo frontend. Me gusta combinar creatividad con tecnología y buscar formas de mejorar la interacción entre usuario y producto. Me emociona ver cómo algo que construyo se convierte en una experiencia real.”',
          image: '/images/team/guillermo.jpg'
        }
      ],
      values: [
        {
          icon: 'mdi-diamond-stone',
          title: 'Excelencia',
          text: 'Nos comprometemos con la más alta calidad en cada aspecto de nuestro servicio, desde la proyección hasta la atención al cliente.'
        },
        {
          icon: 'mdi-lightbulb-on',
          title: 'Innovación',
          text: 'Incorporamos constantemente nuevas tecnologías y tendencias para mejorar la experiencia cinematográfica de nuestros visitantes.'
        },
        {
          icon: 'mdi-hand-heart',
          title: 'Pasión',
          text: 'Amamos el cine y esa pasión se refleja en cada detalle de nuestro servicio y en el cuidado que ponemos en cada proyección.'
        },
        {
          icon: 'mdi-account-group',
          title: 'Comunidad',
          text: 'Fomentamos el amor por el cine en nuestra comunidad, colaborando con proyectos culturales y educativos locales.'
        }
      ],
      stats: [
        {
          icon: 'mdi-movie-roll',
          number: '500+',
          label: 'Películas al Año'
        },
        {
          icon: 'mdi-account-multiple',
          number: '50K+',
          label: 'Visitantes Felices'
        },
        {
          icon: 'mdi-star',
          number: '4.8/5',
          label: 'Calificación'
        },
        {
          icon: 'mdi-trophy',
          number: '3',
          label: 'Años de Experiencia'
        }
      ]
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.hero-section {
  padding: 60px 24px 40px;
  background: #ffffff;
}

.hero-content {
  text-align: center;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c2c2c;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-subtitle {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #2c2c2c;
  max-width: 800px;
  margin: 0 auto;
}

.team-container {
  padding: 60px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.team-card {
  height: 100%;
  border-radius: 8px !important;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  background: #ffffff;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(220, 20, 59, 0.15) !important;
  border-color: #dc143b;
}

.card-header {
  padding: 30px 20px 20px;
  background: #ffffff;
  text-align: center;
}

.avatar-wrapper {
  display: inline-block;
}

.team-avatar {
  border: 3px solid #f5f5f5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.team-name {
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c2c2c;
  padding: 16px 16px 8px;
}

.team-role {
  text-align: center;
  font-size: 0.95rem;
  color: #dc143b;
  font-weight: 600;
  padding: 0 16px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-bio {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #2c2c2c;
  padding: 16px 20px 20px;
  text-align: center;
}

.mission-section {
  padding: 60px 24px;
  background: #f9f9f9;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mission-card {
  height: 100%;
  padding: 30px 25px;
  background: white;
  border-radius: 8px !important;
  border-left: 4px solid #dc143b;
  transition: all 0.3s ease;
}

.mission-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
}

.mission-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.mission-card-title {
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 700;
  color: #2c2c2c;
  padding: 0 0 12px 0;
}

.mission-card-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #2c2c2c;
  text-align: center;
}

.values-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c2c2c;
  position: relative;
}

.values-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 3px;
  background: #dc143b;
  margin: 12px auto 0;
  border-radius: 2px;
}

.value-card {
  height: 100%;
  text-align: center;
  padding: 25px 20px;
  background: white;
  border-radius: 8px !important;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important;
}

.value-icon-container {
  width: 70px;
  height: 70px;
  margin: 0 auto 16px;
  background: #dc143b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(220, 20, 59, 0.3);
}

.value-title {
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c2c2c;
  padding: 8px 16px;
}

.value-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #2c2c2c;
}

.stats-section {
  padding: 50px 24px;
  background: #2c2c2c;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  text-align: center;
  padding: 20px;
}

.stat-icon {
  margin-bottom: 12px;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.05rem;
  }

  .team-container,
  .mission-section {
    padding: 50px 20px;
  }

  .section-title {
    font-size: 1.9rem;
  }

  .mission-card-title {
    font-size: 1.4rem;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 1.7rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .team-name {
    font-size: 1.2rem;
  }

  .team-bio {
    font-size: 0.85rem;
  }

  .section-title {
    font-size: 1.6rem;
    flex-direction: column;
  }

  .mission-card {
    padding: 25px 20px;
  }

  .values-title {
    font-size: 1.5rem;
  }

  .stat-number {
    font-size: 1.8rem;
  }
}
</style>
