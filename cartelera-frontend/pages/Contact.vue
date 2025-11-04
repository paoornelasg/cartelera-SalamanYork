<template>
  <v-app>
    <PageHeader />
    <!-- Contenido Principal -->
    <v-main>
      <ProductImage title="Contact" />

      <div class="main-text-container">
        <h1 style="font-size: 2rem; text-align: center; margin: 1rem 0; padding: 0 1rem;">
          Get In Touch With Us
        </h1>
        <p style="color: gray; font-size: 1rem; text-align: center; max-width: 600px; margin: 0 auto; padding: 0 1rem;">
          For More Information About Our Products & Services. Please Feel Free to Drop Us An Email.
          Our Staff Always Be There To Help You Out. Do Not Hesitate!
        </p>
      </div>

      <v-container class="contact-container" fluid>
        <div class="contact-content-wrapper">
          <!-- Columna Izquierda: Información -->
          <div class="contact-info">
            <v-card flat>
              <v-card-title class="contact-title">
                <v-icon large left color="black">
                  mdi-map-marker
                </v-icon>
                Adress
              </v-card-title>
              <v-card-text class="contact-content">
                236 5th SE Avenue, New York, NY 10000, United States
              </v-card-text>
            </v-card>

            <v-card flat>
              <v-card-title class="contact-title">
                <v-icon large left color="black">
                  mdi-phone
                </v-icon>
                Phone
              </v-card-title>
              <v-card-text class="contact-content">
                <div>+1 234 567 890</div>
                <div>+1 234 567 891</div>
              </v-card-text>
            </v-card>

            <v-card flat>
              <v-card-title class="contact-title">
                <v-icon large left color="black">
                  mdi-clock-outline
                </v-icon>
                Working Time
              </v-card-title>
              <v-card-text class="contact-content">
                <div>Monday–Friday: 9:00 - 22:00</div>
                <div>Saturday-Sunday: 8:00 - 21:00</div>
              </v-card-text>
            </v-card>
          </div>

          <!-- Columna Derecha: Formulario -->
          <div class="contact-form">
            <v-card class="contact-form-card" flat>
              <v-card-title class="form-title">
                Name
              </v-card-title>
              <v-text-field
                v-model="name"
                label="Full name"
                outlined
                class="form-field"
              />
              <v-card-title class="form-title">
                Email
              </v-card-title>
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                class="form-field"
              />
              <v-card-title class="form-title">
                Subject
              </v-card-title>
              <v-text-field
                v-model="subject"
                label="Subject (optional)"
                outlined
                class="form-field"
              />

              <v-card-title class="form-title">
                Message
              </v-card-title>
              <v-textarea
                v-model="message"
                label="Write your message here"
                outlined
                rows="3"
                class="form-field"
              />

              <button class="send-button">
                Submit
              </button>
            </v-card>
          </div>
        </div>
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
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  },
  methods: {
    submitForm () {
      console.log('Formulario enviado:', {
        name: this.name,
        email: this.emailValue,
        subject: this.subject,
        message: this.message
      })
    }
  }
}
</script>

<style scoped>
/* Estilos del header */
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

.header-button:hover {
  opacity: 0.8;
}

.header-button.active {
  font-weight: 700;
  text-decoration: underline;
}

/* Contenedor principal dividido en columnas */
.contact-content-wrapper {
  display: flex;
  gap: 8rem;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}

.contact-info {
  flex: 1;
  min-width: 200px;
  max-width: 750px;
}

.contact-form {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
}

.contact-container {
  padding: 5rem;
}

/* Estilos comunes */
.contact-card {
  margin-bottom: 1.5rem;
  border-left: 4px solid #fb8c00;
}

.contact-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  padding-left: 0;
  align-items: left;
}

.contact-content {
  font-size: 1.1rem;
  color: #555;
  padding-left: 56px;
}

.form-title {
margin-bottom: 0.5rem;
}

.form-field {
  margin-bottom: 0.5rem;
}

.submit-btn {
  margin-top: 1rem;
  text-transform: none;
  letter-spacing: normal;
}

.send-button {
  background-color: black;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.main-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 50px;
}

/* Responsive */
@media (max-width: 768px) {
  .contact-content-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .contact-info,
  .contact-form {
    max-width: 100%;
  }

  .header-buttons-container {
    gap: 30px;
  }
}

@media (max-width: 600px) {
  .header-buttons-container {
    gap: 15px;
  }

  .header-button {
    font-size: 0.9rem;
  }

  .contact-title {
    font-size: 1.3rem;
  }

  .contact-content {
    font-size: 1rem;
    padding-left: 48px;
  }
}
</style>
