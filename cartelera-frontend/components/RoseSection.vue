<template>
  <div class="rose-container">
    <div class="rose-box">
      <h1>Free Delivery</h1>
      <div class="rose-box-text">
        <p>
          For all orders over $2,000 MXN, enjoy completely free shipping.
          Get your favorite furniture delivered to your home at no extra cost.
        </p>
      </div>
    </div>
    <div class="rose-box">
      <h1>90 Days Return</h1>
      <div class="rose-box-text">
        <p>
          If you're not completely satisfied with your purchase, you can return it hassle-free
          within the first 90 days. Your peace of mind is our priority!
        </p>
      </div>
    </div>
    <div class="rose-box">
      <h1>Secure Payment</h1>
      <div class="rose-box-text">
        <p>
          We offer 100% secure payment methods to protect your personal and financial information.
          Shop with complete confidence and security.
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
  background-color: #faf4f4;
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
}

.rose-box-text {
  margin-top: 1rem;
}

.rose-box p {
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  color: #555;
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
