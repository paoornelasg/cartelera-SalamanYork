<template>
  <v-app>
    <v-main>
      <ProductImage title="My Account" />
      <div class="login-wrapper">
        <div class="login-main-container">
          <AppHeader />

          <!--           <div class="left-panel">
            <div class="welcome-text">
              <h4>Qué bueno verte de vuelta</h4>
              <h1>BIENVENIDO</h1>
              <p>
                Disfruta una experiencia cómoda y elegante como nuestros muebles. Inicia sesión para continuar explorando nuestro catálogo y llevar el estilo a tu hogar.
              </p>
            </div>
          </div> -->

          <div class="right-panel login-panel">
            <div class="form-container">
              <h2>Log In</h2>
              <p class="desc">
                Access your account to discover exclusive promotions, track your orders, and save your favorite furniture. Your ideal space is waiting for you!
              </p>
              <form @submit.prevent="iniciarSesion">
                <input v-model="usuario" type="text" placeholder="Username or email address">
                <input v-model="password" type="password" placeholder="Password">
                <div class="options">
                  <label class="remember-label">
                    <input v-model="recordar" type="checkbox">
                    <span class="custom-checkbox" />
                    Remember Me
                  </label>
                  <a href="#" class="forgot-password">
                    Forgot Password?
                  </a>
                </div>
                <button type="submit">
                  Log In
                </button>
                <p v-if="error" style="color: red; margin-top: 10px">
                  {{ error }}
                </p>
              </form>
            </div>
          </div>

          <div class="right-panel register-panel">
            <div class="form-container">
              <h2>Register</h2>
              <form @submit.prevent="registrar">
                <input v-model="nuevoCorreo" type="email" placeholder="Email address">
                <button type="submit">
                  Register
                </button>
                <p class="register-note">
                  A link to set a new password will be sent to your email address.<br><br>
                  Your personal data will be used to support your experience throughout this website,
                  to manage access to your account, and for other purposes described in our <strong>privacy policy</strong>.
                </p>
              </form>
              <p v-if="registroMensaje" style="color: green; margin-top: 10px">
                {{ registroMensaje }}
              </p>
              <p v-if="errorRegistro" style="color: red">
                {{ errorRegistro }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <v-dialog v-model="showCompleteModal" max-width="400">
        <v-card class="pa-4 text-center">
          <v-icon color="green" size="48">
            mdi-check-circle
          </v-icon>
          <h3 class="mt-3">
            Registration Successful
          </h3>
          <p class="text--secondary mt-2">
            Please click the button below to complete your registration.
          </p>
          <v-btn color="black" class="mt-4" dark @click="openSetPasswordModal">
            Complete Registration
          </v-btn>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showPasswordModal" max-width="420">
        <v-card class="pa-4">
          <h3 class="mb-2 text-center">
            Complete Your Registration
          </h3>
          <p class="text--secondary mb-4 text-center">
            Set a password for the account <strong>{{ tempEmail }}</strong>
          </p>

          <v-text-field
            v-model="newPassword"
            label="New Password"
            type="password"
            outlined
            dense
          />

          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            outlined
            dense
          />

          <p v-if="completeError" style="color: red;">
            {{ completeError }}
          </p>

          <div class="text-right mt-4">
            <v-btn color="black" dark @click="submitPassword">
              Submit
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <RoseSection />
      <PageFooter />
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import AppHeader from '~/components/PageHeader.vue'
import ProductImage from '~/components/ProductImage.vue'
import PageFooter from '~/components/PageFooter.vue'
import RoseSection from '~/components/RoseSection.vue'

export default {
  components: {
    AppHeader,
    ProductImage,
    PageFooter,
    RoseSection
  },

  data () {
    return {
      usuario: '',
      password: '',
      recordar: false,
      error: '',
      nuevoCorreo: '',
      registroMensaje: '',
      errorRegistro: '',
      showCompleteModal: false,
      showPasswordModal: false,
      tempEmail: '',
      newPassword: '',
      confirmPassword: '',
      completeError: ''
    }
  },

  methods: {
    async iniciarSesion () {
      this.error = ''
      try {
        const res = await axios.post('http://localhost:5020/api/auth/login', {
          usernameOrEmail: this.usuario,
          password: this.password,
          rememberMe: this.recordar
        })

        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))

        this.$router.push('/shop')
      } catch (err) {
        this.error = err.response?.data?.message || 'Log in failed'
      }
    },

    async registrar () {
      this.registroMensaje = ''
      this.errorRegistro = ''
      try {
        this.tempEmail = this.nuevoCorreo
        await axios.post('http://localhost:5020/api/auth/register', {
          email: this.nuevoCorreo
        })
        this.showCompleteModal = true
      } catch (err) {
        this.errorRegistro = err.response?.data?.message || 'Registration failed'
      }
    },

    openSetPasswordModal () {
      this.showCompleteModal = false
      this.showPasswordModal = true
    },

    async submitPassword () {
      if (this.newPassword !== this.confirmPassword) {
        this.completeError = 'Passwords do not match'
        return
      }

      try {
        const res = await axios.post('http://localhost:5020/api/auth/complete-register', {
          email: this.tempEmail,
          password: this.newPassword
        })

        localStorage.setItem('user', JSON.stringify(res.data))

        this.showPasswordModal = false
        this.nuevoCorreo = ''
        this.newPassword = ''
        this.confirmPassword = ''
        this.completeError = ''
        alert('Registration completed! You can now log in.')
      } catch (err) {
        this.completeError = err.response?.data?.message || 'Error completing registration'
      }
    }
  }
}

</script>

<style scoped>
.left-panel,
.login-panel,
.register-panel {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-panel {
  background: url('../public/images/LoginSegundoMueble.jpg') no-repeat center center;
  background-size: cover;
  color: white;
  text-align: center;
  padding: 2rem;
}

.login-panel,
.register-panel {
  background-color: white;
}

.form-container {
  width: 60%;
  color: #333;
}

.form-container h2 {
  color: black;
  font-size: 1.7rem;
}

.form-container .desc {
  color: #555;
  font-size: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-container input {
  display: block;
  width: 100%;
  padding: 1.5rem 1.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 1.5rem;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  margin-bottom: 1rem;
}

button {
  background-color: white;
  color: black;
  border: 1px solid black;
  border-radius: 6px;
  font-weight: 600;
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  width: 70%;
  max-width: 200px;
  transition: background 0.2s;
}

button:hover {
  background-color: #f3f3f3;
}

.login-main-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  max-width: 1000px;
  margin: 40px auto;
  margin-top: 80px !important;
  margin-bottom: 80px !important;
}

.login-panel, .register-panel {
  flex: 1;
  padding: 30px;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.login-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.forgot-password {
  color: black;
  text-decoration: none;
  font-size: 0.85rem;
}

.register-note {
  font-size: 1rem;
  color: #555;
  margin-top: 1rem;
}

.remember-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}

.remember-label input {
  display: none;
}

.custom-checkbox {
  width: 12px;
  height: 12px;
  border: 1px solid #666;
  border-radius: 3px;
  background-color: #fff;
  position: relative;
  box-sizing: border-box;
}

.remember-label input:checked + .custom-checkbox {
  background-color: black;
  border-color: black;
}

.remember-label input:checked + .custom-checkbox::after {
  content: "";
  position: absolute;
  top: 1px;
  left: 3px;
  width: 2px;
  height: 5px;
  border: solid white;
  border-width: 0 1px 1px 0;
  transform: rotate(45deg);
}

@media (max-width: 768px) {
  .login-main-container {
    flex-direction: column;
  }

  .login-panel,
  .register-panel {
    width: 100%;
  }
}
</style>
