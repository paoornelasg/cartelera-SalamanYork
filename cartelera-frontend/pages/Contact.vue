<template>
  <v-app>
    <PageHeader />
    <v-main>
      <div class="main-text-container">
        <h1>Servicio de Atención</h1>
        <p>
          Para más información sobre nuestras funciones, servicios o asistencia, comunícate con nosotros por correo o mediante el formulario. Nuestro equipo te atenderá con gusto.
        </p>
      </div>

      <v-container class="contact-container" fluid>
        <div class="contact-content-wrapper">
          <div class="contact-form">
            <v-card class="contact-form-card pa-4" flat>
              <v-card-title class="form-main-title">
                Envíanos un mensaje
              </v-card-title>
              <v-card-text class="form-subtitle">
                Completa el formulario y te responderemos en menos de 24 horas hábiles.
              </v-card-text>

              <v-card-title class="form-title pa-0">
                Nombre
              </v-card-title>
              <v-text-field
                v-model="name"
                label="Nombre Completo"
                outlined
                dense
                class="form-field"
              />

              <v-card-title class="form-title pa-0">
                Email
              </v-card-title>
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                dense
                class="form-field"
              />

              <v-card-title class="form-title pa-0">
                Asunto
              </v-card-title>
              <v-text-field
                v-model="subject"
                label="Asunto (opcional)"
                outlined
                dense
                class="form-field"
              />

              <v-card-title class="form-title pa-0">
                Mensaje
              </v-card-title>
              <v-textarea
                v-model="message"
                label="Escribe tu mensaje aquí"
                outlined
                rows="4"
                class="form-field"
              />

              <button class="send-button" @click="submitForm">
                Enviar mensaje
              </button>

              <div class="small-text">
                También puedes escribirnos directamente a
                <strong>soporte@cine-ejemplo.com</strong>
              </div>
            </v-card>
          </div>

          <div class="contact-info">
            <div class="contact-info-grid">
              <v-card flat class="contact-card">
                <v-card-title class="contact-title">
                  <v-icon large left color="black">
                    mdi-map-marker
                  </v-icon>
                  Dirección
                </v-card-title>
                <v-card-text class="contact-content">
                  Salamanca, Guanajuato, México<br>
                  Blvd. Entretenimiento #123, Col. Centro
                </v-card-text>
              </v-card>

              <v-card flat class="contact-card">
                <v-card-title class="contact-title">
                  <v-icon large left color="black">
                    mdi-phone
                  </v-icon>
                  Teléfono
                </v-card-title>
                <v-card-text class="contact-content">
                  <div>+52 464 123 45 67</div>
                  <div>+52 800 123 CINE (2463)</div>
                </v-card-text>
              </v-card>

              <v-card flat class="contact-card">
                <v-card-title class="contact-title">
                  <v-icon large left color="black">
                    mdi-clock-outline
                  </v-icon>
                  Horario
                </v-card-title>
                <v-card-text class="contact-content">
                  <div>Lunes–Viernes: 9:00 - 22:00</div>
                  <div>Sábado–Domingo: 8:00 - 21:00</div>
                  <div>Soporte en línea: 24/7</div>
                </v-card-text>
              </v-card>

              <v-card flat class="contact-card">
                <v-card-title class="contact-title">
                  <v-icon large left color="black">
                    mdi-email-outline
                  </v-icon>
                  Correos de contacto
                </v-card-title>
                <v-card-text class="contact-content">
                  <div>soporte@cine-ejemplo.com</div>
                  <div>ventas@cine-ejemplo.com</div>
                  <div>facturacion@cine-ejemplo.com</div>
                </v-card-text>
              </v-card>

              <v-card flat class="contact-card">
                <v-card-title class="contact-title">
                  <v-icon large left color="black">
                    mdi-whatsapp
                  </v-icon>
                  WhatsApp
                </v-card-title>
                <v-card-text class="contact-content">
                  <div>+52 1 464 987 65 43</div>
                  <div>Atención rápida para dudas y reservaciones.</div>
                </v-card-text>
              </v-card>

              <v-card flat class="contact-card">
                <v-card-title class="contact-title">
                  <v-icon large left color="black">
                    mdi-headset
                  </v-icon>
                  Centro de ayuda
                </v-card-title>
                <v-card-text class="contact-content">
                  <div>chat.cine-ejemplo.com</div>
                  <div>Consulta preguntas frecuentes y reporta problemas técnicos.</div>
                </v-card-text>
              </v-card>
            </div>

            <v-card flat class="contact-card social-card">
              <v-card-title class="contact-title social-title">
                Síguenos en Nuestras Redes Sociales
              </v-card-title>
              <v-card-text class="contact-content social-buttons">
                <v-btn
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener"
                  class="social-btn"
                  outlined
                  small
                >
                  <v-icon left>
                    mdi-facebook
                  </v-icon>
                  Facebook
                </v-btn>

                <v-btn
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener"
                  class="social-btn"
                  outlined
                  small
                >
                  <v-icon left>
                    mdi-instagram
                  </v-icon>
                  Instagram
                </v-btn>

                <v-btn
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener"
                  class="social-btn"
                  outlined
                  small
                >
                  <v-icon left>
                    mdi-twitter
                  </v-icon>
                  Twitter
                </v-btn>

                <v-btn
                  href="https://www.tiktok.com/"
                  target="_blank"
                  rel="noopener"
                  class="social-btn"
                  outlined
                  small
                >
                  <v-icon left>
                    mdi-music-note
                  </v-icon>
                  TikTok
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-container>

      <RoseSection />
      <PageFooter />

      <!-- Snackbars fuera de card para que no se recorten -->
      <v-snackbar
        v-model="showSuccess"
        timeout="5000"
        color="green"
        absolute
        bottom
        right
      >
        {{ successMessage }}
        <v-btn text @click="showSuccess = false">
          Cerrar
        </v-btn>
      </v-snackbar>

      <v-snackbar
        v-model="showError"
        timeout="7000"
        color="red"
        absolute
        bottom
        right
      >
        {{ errorMessage }}
        <v-btn text @click="showError = false">
          Cerrar
        </v-btn>
      </v-snackbar>
    </v-main>
  </v-app>
</template>
<script>
import PageHeader from '~/components/PageHeader.vue'
import RoseSection from '~/components/RoseSection.vue'
import PageFooter from '~/components/PageFooter.vue'

export default {
  components: {
    RoseSection,
    PageFooter,
    PageHeader
  },
  data () {
    return {
      name: '',
      email: '',
      subject: '',
      message: '',
      submitting: false,
      successMessage: '',
      errorMessage: '',
      showSuccess: false,
      showError: false
    }
  },
  methods: {
    async submitForm () {
      this.errorMessage = ''
      this.successMessage = ''

      // Requerir que el usuario esté autenticado
      const rawUser = localStorage.getItem('user')
      if (!rawUser) {
        this.errorMessage = 'Debes iniciar sesión para enviar un mensaje.'
        return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        this.errorMessage = 'Token de autenticación no encontrado. Inicia sesión de nuevo.'
        return
      }

      const payload = {
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.message
      }

      const headers = { headers: { Authorization: `Bearer ${token}` } }

      try {
        this.submitting = true
        // console.log('Contact.submitForm - payload:', payload)
        // console.log('Contact.submitForm - token present:', !!token)
        const res = await this.$axios.post('/contact', payload, headers)
        console.log('Contact.submitForm - response:', res)
        this.successMessage = 'Mensaje enviado correctamente. Te responderemos pronto.'
        this.showSuccess = true
        // limpiar formulario
        this.name = ''
        this.email = ''
        this.subject = ''
        this.message = ''
      } catch (err) {
        // console.error('Contact.submitForm - error:', err)
        this.errorMessage = err.response?.data?.message || err.message || 'Error al enviar el mensaje.'
        this.showError = true
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
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

.main-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 50px;
  background-color: #2c2c2c;
  padding: 2.5rem 1rem;
  width: 100%;
  box-sizing: border-box;
}

.main-text-container h1 {
  color: #ffffff;
  font-size: 2.6rem;
  margin-bottom: 0.5rem;
}

.main-text-container p {
  color: #e6e6e6;
  font-size: 1rem;
  max-width: 620px;
}

.contact-container {
  padding: 4rem 2rem;
  background-color: #f5f5f5;
}

.contact-content-wrapper {
  display: flex;
  flex-direction: row;
  gap: 4rem;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}

.contact-form {
  flex: 1;
  min-width: 320px;
  max-width: 420px;
}

.contact-info {
  flex: 1;
  min-width: 320px;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.5rem;
}

.contact-card {
  border-radius: 12px;
  background-color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding-bottom: 0.75rem;
}

.social-card {
  padding-top: 1rem;
}

.contact-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  padding-left: 0;
  align-items: center;
}

.contact-content {
  font-size: 0.95rem;
  color: #555;
  padding-left: 40px;
}

.social-title {
  margin-bottom: 0.25rem;
}

.social-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-left: 0;
}

.social-btn {
  text-transform: none;
  font-weight: 500;
  border-radius: 999px;
}

.contact-form-card {
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.form-main-title {
  font-size: 1.25rem;
  font-weight: 700;
  padding-bottom: 0;
}

.form-subtitle {
  font-size: 0.9rem;
  color: #7a7a7a;
  margin: 0.25rem 0 1rem;
  padding: 0 0.25rem 0 0;
  line-height: 1.4;
}

.form-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.1rem;
}

.form-field {
  margin-bottom: 0.7rem;
}

.send-button {
  margin-top: 0.75rem;
  width: 100%;
  background-color: #db133b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.3px;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.3s ease;
}

.send-button:hover {
  background-color: #b50f30;
  box-shadow: 0 4px 10px rgba(219, 19, 59, 0.45);
  transform: translateY(-1px);
}

.send-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(219, 19, 59, 0.35);
}

.small-text {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #777;
  text-align: center;
}

@media (max-width: 900px) {
  .contact-container {
    padding: 3rem 1.5rem;
  }

  .contact-content-wrapper {
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .contact-container {
    padding: 3rem 1.25rem;
  }
}

@media (max-width: 600px) {
  .main-text-container h1 {
    font-size: 2.1rem;
  }

  .main-text-container p {
    font-size: 0.95rem;
  }

  .header-buttons-container {
    gap: 15px;
  }

  .header-button {
    font-size: 0.9rem;
  }

  .contact-content {
    padding-left: 32px;
  }
}
</style>
