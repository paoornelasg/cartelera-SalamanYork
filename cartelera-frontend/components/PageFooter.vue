<template>
  <footer class="main-footer">
    <div class="footer-columns">
      <div class="column">
        <h4 class="footer-title">
          Links
        </h4>
        <NuxtLink to="/Home" class="footer-link">
          Home
        </NuxtLink>
        <NuxtLink to="/shop" class="footer-link">
          Shop
        </NuxtLink>
        <NuxtLink to="/about" class="footer-link">
          About
        </NuxtLink>
        <NuxtLink to="/contact" class="footer-link">
          Contact
        </NuxtLink>
      </div>

      <div class="column">
        <h4 class="footer-title">
          Help
        </h4>
        <NuxtLink to="/Home" class="footer-link">
          Payment options
        </NuxtLink>
        <NuxtLink to="/Home" class="footer-link">
          Returns
        </NuxtLink>
        <NuxtLink to="/Home" class="footer-link">
          Privacy Policies
        </NuxtLink>
      </div>

      <div class="column">
        <h4 class="footer-title">
          Bulletin
        </h4>
        <form @submit.prevent="handleSubscribe" class="subscription-form">
          <input
            v-model="email"
            type="email"
            placeholder="Insert your email"
            required
          >
          <button type="submit">
            SUBSCRIBE
          </button>
        </form>
        <p v-if="mensajeSubscripcion" class="subscription-message">{{ mensajeSubscripcion }}</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'PageFooter',

  data () {
    return {
      email: '',
      mensajeSubscripcion: ''
    }
  },

  methods: {
    handleSubscribe () {
      if (this.validarEmail(this.email)) {
        // Simular suscripción
        this.mensajeSubscripcion = '¡Gracias por suscribirte!';
        this.email = '';
      } else {
        this.mensajeSubscripcion = 'Por favor ingresa un correo válido.';
      }

      // Borrar mensaje después de 4 segundos
      setTimeout(() => {
        this.mensajeSubscripcion = '';
      }, 4000);
    },
    validarEmail (correo) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(correo);
    }
  }
}
</script>

<style scoped>
.main-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2; /* o el que prefieras */
  padding: 2rem 5%;
  width: 100vw;
  min-height: 200px;
  box-sizing: border-box;
}

.footer-columns {
  display: flex;
  gap: 4rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-width: 200px;
}

.column h4 {
  color: #2d3436;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.column ul {
  list-style: none;
  padding: 0;
}

.column li {
  margin-bottom: 0.5rem;
  color: #636e72;
  cursor: pointer;
  transition: color 0.3s;
}

.column li:hover {
  color: #2d3436;
}

form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

form input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  flex-grow: 1;
  min-width: 200px;
}

form button {
  background-color: #2d3436;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  transition: background 0.3s;
}

form button:hover {
  background-color: #434d50;
}

.contact-info {
  text-align: center;
  margin: 2rem 0;
  color: #636e72;
  line-height: 1.5;
}

.copyright {
  text-align: center;
  color: #636e72;
  margin-bottom: 2rem;
}

.signup-section {
  text-align: center;
  margin-top: 2rem;
}

.signup-section p {
  color: #636e72;
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-buttons button {
  padding: 0.75rem 2rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
}

.signup-btn {
  background-color: #2d3436;
  color: white;
}

.continue-btn {
  background-color: #ddd;
  color: #2d3436;
}

.action-buttons button:hover {
  opacity: 0.9;
}

.footer-link {
  color: black;
  text-decoration: none;
  font-weight: 400;
}

.footer-title {
  color: crimson;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.subscription-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.subscription-form input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.subscription-form button {
  padding: 10px;
  border-radius: 5px;
  background-color: black;
  color: white;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.subscription-form button:hover {
  background-color: #333;
}

.subscription-message {
  margin-top: 10px;
  font-size: 0.9rem;
  color: green;
}

@media (max-width: 768px) {
  .footer-columns {
    flex-direction: column;
    gap: 2rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    width: 100%;
  }
}
</style>
