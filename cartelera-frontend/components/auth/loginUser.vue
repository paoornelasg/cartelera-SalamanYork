<template>
  <v-container fluid class="grey lighten-4 pa-0">
    <!-- Encabezado tipo Figma -->
    <v-sheet color="primary" height="180" class="d-flex flex-column justify-center align-center white--text">
      <h1 class="display-1 font-weight-bold mb-1">
        My Account
      </h1>
      <span class="subtitle-1">Home / My Account</span>
    </v-sheet>

    <!-- Login y register -->
    <v-container class="py-12">
      <v-row>
        <!-- Login -->
        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2">
            <h2 class="headline font-weight-medium mb-4">
              Log In
            </h2>
            <v-text-field
              v-model="usuario"
              label="Username or email address"
              outlined
              dense
              prepend-icon="mdi-account"
            />
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              outlined
              dense
              prepend-icon="mdi-lock"
            />
            <v-checkbox v-model="rememberMe" label="Remember me" class="mt-1" />
            <v-btn color="primary" class="mt-4" block @click="login">
              Log In
            </v-btn>
            <div class="text-caption mt-2 text-right">
              <NuxtLink to="#">
                Forgot your password?
              </NuxtLink>
            </div>
          </v-card>
        </v-col>

        <!-- Register -->
        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2">
            <h2 class="headline font-weight-medium mb-4">
              Register
            </h2>
            <v-text-field
              v-model="registerEmail"
              label="Email address"
              outlined
              dense
              prepend-icon="mdi-email"
            />
            <p class="body-2 mt-4">
              A link to set a new password will be sent to your email address.
              Your personal data will be used to support your experience throughout this website,
              to manage access to your account, and for other purposes described in our
              <NuxtLink to="#" class="primary--text">
                privacy policy
              </NuxtLink>.
            </p>
            <v-btn color="primary" class="mt-4" block @click="register">
              Register
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      usuario: '',
      password: '',
      rememberMe: false,
      registerEmail: ''
    }
  },
  methods: {
    async login () {
      if (!this.usuario || !this.password) {
        this.$store.dispatch('alert/triggerAlert', {
          type: 'error',
          message: 'Por favor completa todos los campos.'
        })
        return
      }

      try {
        const response = await this.$axios.post('/users/login', {
          usuario: this.usuario,
          password: this.password
        })

        if (response.data.token) {
          this.$store.dispatch('alert/triggerAlert', {
            type: 'success',
            message: 'Inicio de sesión exitoso.'
          })
          console.log('Login exitoso, redirigiendo...')
          this.$router.push('/principal')
        } else {
          this.$store.dispatch('alert/triggerAlert', {
            type: 'error',
            message: 'Correo o contraseña incorrectos.'
          })
        }
      } catch (error) {
        console.error(error)
        this.$store.dispatch('alert/triggerAlert', {
          type: 'error',
          message: 'Error al conectar con el servidor.'
        })
      }
    },
    register () {
      if (!this.registerEmail) {
        this.$store.dispatch('alert/triggerAlert', {
          type: 'error',
          message: 'Por favor ingresa un correo válido.'
        })
        return
      }

      this.$store.dispatch('alert/triggerAlert', {
        type: 'success',
        message: 'Se envió un enlace de registro al correo.'
      })
    }
  }
}
</script>
