<template>
  <div class="product-image-container">
    <div class="text-content">
      <h1 class="product-image-title">
        {{ title }}
      </h1>
      <div class="breadcrumb">
        <NuxtLink to="/cartelera">
          Cartelera
        </NuxtLink>
        <span>›</span>
        <span class="current">{{ title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Mi cuenta'
    }
  }
}
</script>

<style scoped>
.product-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 500px;
/*   border: 1px solid cadetblue; */
  background-color: #f4f4f4;
  background-image: url('../public/images/HeaderImage.png');
  opacity: 1;
  height: 420px;
  background: url('../public/images/HeaderImage.png') center/cover no-repeat;
}
.product-image-container::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.35));
}

.text-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 16px;
}

.product-image-title {
  font-size: 3rem;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  text-shadow: 0 2px 12px rgba(0,0,0,.35);
}

.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 1.05rem;
  color: rgba(255,255,255,.9);
}
.breadcrumb a {
  text-decoration: none;
  color: #fff;
  font-weight: 600;
}
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb span { font-weight: 600; color: rgba(255,255,255,.85); }
.breadcrumb .current { font-weight: 400; color: rgba(255,255,255,.8); }

@media (max-width: 768px) {
  .product-image-container { height: 300px; }
  .product-image-title { font-size: 2.1rem; }
  .breadcrumb { font-size: .95rem; flex-wrap: wrap; }
}

@media (max-width: 480px) {
  .product-image-container { height: 240px; }
  .product-image-title { font-size: 1.7rem; }
  .breadcrumb { font-size: .85rem; }
}
</style>
