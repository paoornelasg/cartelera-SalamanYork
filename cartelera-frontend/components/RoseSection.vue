<template>
  <div class="rose-container">
    <div class="rose-box">
      <h1>Compra Fácil</h1>
      <div class="rose-box-text">
        <p class="rose-text">
          Adquiere tus boletos en línea de forma rápida y sencilla. Disfruta tus películas favoritas sin filas ni complicaciones.
        </p>
      </div>
    </div>
    <div class="rose-box">
      <h1>Cambios y Reembolsos</h1>
      <div class="rose-box-text">
        <p class="rose-text">
          ¿Tuviste un inconveniente con tu compra? Podrás cambiar o solicitar reembolso de tus boletos. Queremos que disfrutes sin preocupaciones.
        </p>
      </div>
    </div>
    <div class="rose-box">
      <h1>Pago Seguro</h1>
      <div class="rose-box-text">
        <p class="rose-text">
          Tus datos están protegidos con métodos de pago 100% seguros. Compra tus boletos con total confianza y tranquilidad.
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
  gap: 5rem;
  padding: 5rem;
  background-color: #2c2c2c;
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
  font-size: clamp(1.3rem, 2.2vw, 2rem);
  font-weight: 600;
  color: white;
  color: white;
}

.rose-box-text {
  margin-top: 1rem;
}

.rose-box p {
  font-size: clamp(1rem, 1.6vw, 1.15rem);
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
