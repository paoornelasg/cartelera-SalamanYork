<template>
  <div class="rose-container">
    <div class="rose-box">
      <h1>Compra Fácil</h1>
      <div class="rose-box-text">
        <p>
          Adquiere tus boletos en línea de forma rápida y sencilla.
        </p>
      </div>
    </div>
    <div class="rose-box">
      <h1>Cambios y Reembolsos</h1>
      <div class="rose-box-text">
        <p>
          Si tuviste un inconveniente podrás cambiar o solicitar reembolso de tus boletos.
        </p>
      </div>
    </div>
    <div class="rose-box">
      <h1>Pago Seguro</h1>
      <div class="rose-box-text">
        <p>
          Tus datos están protegidos con métodos de pago 100% seguros.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoseSection'
}
</script>

<style scoped>
.rose-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 2rem;
  background-color: #0A0A0A;
  width: 100%;
  box-sizing: border-box;
}

.rose-box {
  flex: 1 1 300px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.rose-box h1 {
  margin: 0;
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  font-weight: 600;
  color: white;
  color: white;
}

.rose-box-text {
  margin-top: 0.5rem;
}

.rose-box p {
  font-size: clamp(0.95rem, 1.6vw, .75rem);
  color: white;
}

@media (max-width: 768px) {
  .rose-container {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .rose-box {
    width: 90%;
  }
}
</style>
