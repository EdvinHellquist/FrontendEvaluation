<template>
  <div class="main">
    <SearchBar :searchQuery="searchQuery" @updateQuery="setSearchQuery" />
    <div class="item-grid">
      <template v-if="items.length > 0">
        <ProductPreview 
          v-for="item in items" 
          :key="item.id" 
          :id="item.id" 
          :name="item.name" 
          :description="item.description" 
        />
      </template>
      <p v-else>No items found</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Navbar from '../components/navbar.vue';
import SearchBar from '../components/searchBar.vue';
import ProductPreview from '../components/productpreview.vue';
import Footer from '../components/footer.vue';
import { url, port } from '../../serverip';

export default {
  components: {
    Navbar,
    SearchBar,
    ProductPreview,
    Footer
  },
  setup() {
    const searchQuery = ref('');
    const items = ref([]);

    const fetchItems = async (query) => {
      const endpoint = query ? `/search?q=${encodeURIComponent(query)}` : '/shop/products';
      console.log(`${url}:${port}${endpoint}`);

      try {
        const response = await fetch(`${url}:${port}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          items.value = result.products || result;
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    onMounted(() => {
      fetchItems(searchQuery.value);
    });

    watch(searchQuery, (newQuery) => {
      fetchItems(newQuery);
    });

    const setSearchQuery = (query) => {
      searchQuery.value = query;
    };

    return {
      searchQuery,
      items,
      setSearchQuery
    };
  }
};
</script>

<style scoped>
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  justify-content: center;
}

.item {
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
  transition: transform 0.3s;
}

.item:hover {
  transform: scale(1.05);
}

.item h3 {
  margin: 0 0 10px;
}

.item p {
  margin: 0;
}

body {
  width: 100vw;
  display: flex;
  justify-content: center;
}
</style>
