<script>
  import { onMount } from 'svelte';
  import Navbar from '$lib/Navbar.svelte';
  import SearchBar from '$lib/SearchBar.svelte';
  import ProductPreview from '$lib/ProductPreview.svelte';
  import Footer from '$lib/Footer.svelte';
  const url = 'http://localhost';
  const port = '3004';

  let searchQuery = '';
  let items = [];

  const fetchItems = async (query) => {
    const endpoint = query ? `/search?q=${encodeURIComponent(query)}` : '/shop/products';
    try {
      const response = await fetch(`${url}:${port}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const result = await response.json();
        items = result.products || result;
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  $: fetchItems(searchQuery);

  onMount(() => {
    fetchItems('');
  });
</script>

<style>
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  justify-content: center;
}
</style>

<div class="main">
  <Navbar />
  <SearchBar bind:searchQuery />
  <div class="item-grid">
    {#if items.length > 0}
      {#each items as item (item.id)}
        <ProductPreview id={item.id} name={item.name} description={item.description} />
      {/each}
    {:else}
      <p>No items found</p>
    {/if}
  </div>
  <Footer />
</div>
