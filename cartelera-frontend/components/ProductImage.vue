<template>
  <div class="product-image-container">
    <div class="text-content">
      <h1 class="product-image-title">
        {{ title }}
      </h1>
      <div class="breadcrumb">
        <NuxtLink to="/Home">Home</NuxtLink>
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
      default: 'My Account'
    }
  }
}
</script>

<style scoped>
.product-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 500px;
/*   border: 1px solid cadetblue; */
  background-color: #f4f4f4;
  background-image: url('../public/images/HeaderImage.png');  
  opacity: 0.7;
}

.product-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  opacity: 0.5;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px;
}

.product-image-title {
  font-size: 3rem;
  color: black;
  text-align: center;
  margin: 0;
  padding: 20px;
  opacity: 1;
}

.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  gap: 8px;
  margin-top: 10px;
  color: #444;
}

.breadcrumb a {
  text-decoration: none;
  color: #000;
  font-weight: bold;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb span {
  font-weight: bold;
}

.breadcrumb .current {
  font-weight: normal;
  color: #666;
}

@media (max-width: 768px) {
  .product-image-container {
    height: 300px;
    background-size: cover;
    background-position: center;
    padding: 0 20px;
  }

  .product-image-title {
    font-size: 2rem;
    padding: 10px;
  }

  .breadcrumb {
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 0.95rem;
    text-align: center;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .product-image-container {
    height: 250px;
    padding: 0 15px;
  }

  .product-image-title {
    font-size: 1.6rem;
  }

  .breadcrumb {
    font-size: 0.85rem;
  }
}

</style>
