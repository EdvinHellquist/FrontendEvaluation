<template>
  <div>
    <div class="product-details" v-if="!loading">
      <div v-if="product">
        <img v-if="productImage" :src="productImage" :alt="product.name" class="product-image" />
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <p><strong>Price:</strong> ${{ product.price }}</p>
        <div class="color-swatch" :style="{ backgroundColor: product.color }"></div>
      </div>
      <p v-else>Product not found</p>
    </div>
    <p v-if="loading">Loading...</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { url, port } from '../../serverip';

export default {
  components: {
    Navbar,
    Footer
  },
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const product = ref(null);
    const loading = ref(true);
    const productImage = ref(null);

    onMounted(async () => {
      try {
        const response = await fetch(`${url}:${port}/shop/products${id}`);
        const data = await response.json();
        product.value = data;

        const image = await import(`../assets/images/${data.image}` /* @vite-ignore */);
        productImage.value = image.default;
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        loading.value = false;
      }
    });

    return {
      product,
      loading,
      productImage
    };
  }
};
</script>

<style scoped>
.product-details {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.product-details h2 {
  font-size: 1.8rem;
  color: #333;
}

.product-details p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 12px;
}

.product-image {
  width: 100%;
  height: auto;
  max-width: 400px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ddd;
  display: inline-block;
  margin-top: 12px;
}
</style>