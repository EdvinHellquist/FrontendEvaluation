<script>
  import Navbar from '$lib/Navbar.svelte';
  import Footer from '$lib/Footer.svelte';
  import { page } from '$app/stores';
  const url = 'http://localhost';
  const port = '3004';
  let product = $state(null);
  let loading = $state(true);
  let productImage = $state(null);

  const fetchProduct = async () => {
    try {
      const { params } = $page;
      const response = await fetch(`${url}:${port}/shop/products${params.id}`);
      const data = await response.json();
      product = data;

      const image = await import(`../../../assets/images/${data.image}`);
      productImage = image.default;
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      loading = false;
    }
  };

  fetchProduct();
</script>

<style>
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
{#if loading}
  <p>Loading...</p>
{:else if !product}
  <p>Product not found</p>
{:else}
  <div>
    <Navbar />
    <div class="product-details">
      {#if productImage}
        <img src={productImage} alt={product.name} class="product-image" />
      {/if}
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <div class="color-swatch" style="background-color: {product.color};"></div>
    </div>
    <Footer />
  </div>
{/if}
