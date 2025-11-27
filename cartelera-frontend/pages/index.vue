<template>
  <v-app>
    <v-main>
      <ProductImage title="Mi cuenta" />

      <section class="account-page">
        <div class="account-grid">
          <div class="panel">
            <h2 class="section-title">
              Iniciar sesión
            </h2>
            <p class="section-desc">
              Accede para comprar tus boletos, ver horarios, revisar tus compras y guardar tus películas favoritas.
            </p>

            <form class="form-styled" @submit.prevent="iniciarSesion">
              <label class="field-label">Usuario o correo electrónico</label>
              <input
                v-model="usuario"
                type="text"
                class="input-styled"
                autocomplete="username"
                placeholder=""
              >

              <label class="field-label">Contraseña</label>
              <input
                v-model="password"
                type="password"
                class="input-styled"
                autocomplete="current-password"
                placeholder=""
              >

              <div class="row-opts">
                <label class="remember-label">
                  <input v-model="recordar" type="checkbox">
                  <span class="custom-checkbox" />
                  <span>Recordarme</span>
                </label>

                <a href="#" class="link-muted">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" class="btn-primary">
                Iniciar sesión
              </button>

              <p v-if="error" class="msg-error">
                {{ error }}
              </p>
            </form>
          </div>

          <div class="panel">
            <h2 class="section-title">
              Registrarse
            </h2>

            <form class="form-styled" @submit.prevent="registrar">
              <label class="field-label">Correo electrónico</label>
              <input
                v-model="nuevoCorreo"
                type="email"
                class="input-styled"
                autocomplete="email"
                placeholder=""
              >

              <p class="small-copy mt-16">
                Te enviaremos un enlace para establecer tu contraseña y completar tu registro.
              </p>
              <p class="small-copy">
                Tus datos personales se utilizarán para brindarte una mejor experiencia en esta cartelera, gestionar el acceso a tu cuenta y para otros fines descritos en nuestra <strong>política de privacidad</strong>.
              </p>

              <button type="submit" class="btn-ghost">
                Registrarse
              </button>

              <p v-if="registroMensaje" class="msg-ok">
                {{ registroMensaje }}
              </p>
              <p v-if="errorRegistro" class="msg-error">
                {{ errorRegistro }}
              </p>
            </form>
          </div>
        </div>
      </section>

      <v-dialog v-model="showCompleteModal" max-width="400">
        <v-card class="pa-4 text-center">
          <v-icon color="green" size="48">
            mdi-check-circle
          </v-icon>
          <h3 class="mt-3">
            Registro enviado
          </h3>
          <p class="text--secondary mt-2">
            Da clic en el botón para completar tu registro.
          </p>
          <v-btn color="black" class="mt-4" dark @click="openSetPasswordModal">
            Completar registro
          </v-btn>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showPasswordModal" max-width="420">
        <v-card class="pa-4">
          <h3 class="mb-2 text-center">
            Completar registro
          </h3>
          <p class="text--secondary mb-4 text-center">
            Define una contraseña para la cuenta <strong>{{ tempEmail }}</strong>
          </p>

          <v-text-field v-model="newPassword" label="Nueva contraseña" type="password" outlined dense />
          <v-text-field v-model="confirmPassword" label="Confirmar contraseña" type="password" outlined dense />
          <p v-if="completeError" class="msg-error">
            {{ completeError }}
          </p>

          <div class="text-right mt-4">
            <v-btn color="black" dark @click="submitPassword">
              Enviar
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="alertaVisible"
        :color="alertaColor"
        top
        right
        :timeout="3000"
        rounded="pill"
      >
        {{ alerta }}

        <template #action="{ attrs }">
          <v-btn
            text
            icon
            v-bind="attrs"
            @click="alertaVisible = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

      <RoseSection />
      <PageFooter />
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
// import AppHeader from '~/components/PageHeader.vue'
import ProductImage from '~/components/ProductImage.vue'
import PageFooter from '~/components/PageFooter.vue'
import RoseSection from '~/components/RoseSection.vue'

export default {
  components: {
    // AppHeader,
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
      alerta: '',
      alertaColor: '',
      alertaVisible: false,
      completeError: ''
    }
  },

  mounted () {
    // Verificar si hay un mensaje de cierre de sesión
    const logoutMessage = this.$route.query.logout
    if (logoutMessage === 'true') {
      this.mostrarAlerta('Has cerrado sesión exitosamente', 'success')
      // Limpiar el query parameter de la URL sin recargar
      const query = Object.assign({}, this.$route.query)
      delete query.logout
      this.$router.replace({ query })
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

        this.mostrarAlerta('Inicio de sesión exitoso', 'success')

        setTimeout(() => {
          this.$router.push('/shop')
        }, 1000)
      } catch (err) {
        const msg = err.response?.data?.message || 'Error al iniciar sesión'
        this.mostrarAlerta(msg, 'error')
      }
    },

    cerrarSesion () {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.mostrarAlerta('Has cerrado sesión exitosamente', 'success')
      setTimeout(() => {
        this.$router.push('/account')
      }, 1000)
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
        this.mostrarAlerta('Registro enviado a tu correo', 'success')
      } catch (err) {
        const msg = err.response?.data?.message || 'No se pudo registrar'
        this.mostrarAlerta(msg, 'error')
      }
    },

    openSetPasswordModal () {
      this.showCompleteModal = false
      this.showPasswordModal = true
    },

    mostrarAlerta (mensaje, tipo = 'info') {
      this.alerta = mensaje

      // Asignar colores correctos según el tipo
      if (tipo === 'error') {
        this.alertaColor = 'red darken-2'
      } else if (tipo === 'success') {
        this.alertaColor = 'green darken-1'
      } else if (tipo === 'warning') {
        this.alertaColor = 'orange darken-2'
      } else {
        this.alertaColor = 'blue darken-1'
      }

      this.alertaVisible = true
    },

    async submitPassword () {
      if (this.newPassword !== this.confirmPassword) {
        this.completeError = 'Las contraseñas no coinciden'
        this.mostrarAlerta('Las contraseñas no coinciden', 'error')
        return
      }

      try {
        const res = await axios.post('http://localhost:5020/api/auth/complete-register', {
          email: this.tempEmail,
          password: this.newPassword
        })

        localStorage.setItem('user', JSON.stringify(res.data))

        this.showPasswordModal = false

        this.newPassword = ''
        this.confirmPassword = ''
        this.completeError = ''

        this.mostrarAlerta('Registro completado. Ahora puedes iniciar sesión.', 'success')
      } catch (err) {
        const msg = err.response?.data?.message || 'Error al completar el registro'
        this.mostrarAlerta(msg, 'error')
      }
    }
  }
}
</script>

<style scoped>
.account-page {
  background:#fff;
  padding: 48px 0 80px;
}
.account-grid{
  width:100%;
  max-width:1140px;
  margin:0 auto;
  padding:0 20px;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:56px;
}
.panel{
  background:transparent;
}
.section-title{
  font-size:28px;
  line-height:1.1;
  font-weight:800;
  color:#111;
  margin:8px 0 8px;
}
.section-desc{
  color:#6b6f76;
  font-size:14.5px;
  margin:0 0 18px;
}
.form-styled{ display:flex; flex-direction:column; }
.field-label{
  font-size:12.5px;
  color:#6b6f76;
  letter-spacing:.2px;
  margin-bottom:8px;
}
.input-styled{
  height:48px;
  padding:0 14px;
  border-radius:10px;
  border:1px solid #e2e2e2;
  background:#fff;
  outline:none;
  font-size:14px;
  color:#222;
  transition:border-color .18s ease, box-shadow .18s ease;
  box-shadow:0 1px 0 rgba(0,0,0,.02);
}
.input-styled + .field-label,
.input-styled + .input-styled{ margin-top:16px; }
.input-styled:focus{
  border-color:#c9c9c9;
  box-shadow:0 0 0 3px rgba(0,0,0,.04);
}
.small-copy{ font-size:12.8px; color:#6b6f76; line-height:1.6; margin:0; }
.mt-16{ margin-top:16px; }
.row-opts{
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  margin:14px 0 18px;
}
.remember-label{
  display:inline-flex; align-items:center; gap:8px; font-size:13px; color:#3a3a3a; cursor:pointer; user-select:none;
}
.remember-label input{ display:none; }
.custom-checkbox{
  width:16px; height:16px; border:1px solid #bdbdbd; border-radius:4px; background:#fff; position:relative; box-sizing:border-box;
}
.remember-label input:checked + .custom-checkbox{
  background:#111; border-color:#111;
}
.remember-label input:checked + .custom-checkbox::after{
  content:""; position:absolute; top:2px; left:5px; width:3px; height:8px;
  border:solid #fff; border-width:0 2px 2px 0; transform:rotate(45deg);
}
.link-muted{ color:#8a8f96; text-decoration:none; font-size:13px; }
.link-muted:hover{ text-decoration:underline; }
.btn-primary{
  display:inline-block;
  height:46px;
  padding:0 22px;
  border-radius:10px;
  border:0;
  background:#c22f2f;
  color:#ffffff;
  font-weight:800;
  letter-spacing:.2px;
  box-shadow:0 10px 24px rgba(0,0,0,.15);
  cursor:pointer;
  width:220px;
}
.btn-primary:hover{ filter:brightness(.97); }
.btn-ghost{
  display:inline-block;
  height:46px;
  padding:0 22px;
  border-radius:10px;
  border:1px solid #cfcfcf;
  background:#fff;
  color:#1d1d1f;
  font-weight:600;
  letter-spacing:.2px;
  transition:all .18s ease;
  width:220px;
}
.btn-ghost:hover{ border-color:#a9a9a9; box-shadow:0 2px 10px rgba(0,0,0,.04); }
.msg-error{ color:#d32727; font-size:13px; margin-top:12px; }
.msg-ok{ color:#2e7d32; font-size:13px; margin-top:12px; }
@media (max-width:1024px){ .account-grid{ gap:40px; } }
@media (max-width:860px){
  .account-grid{ grid-template-columns:1fr; gap:28px; }
  .btn-primary,.btn-ghost{ width:100%; }
  .row-opts{ flex-direction:column; align-items:flex-start; gap:10px; }
}
</style>
