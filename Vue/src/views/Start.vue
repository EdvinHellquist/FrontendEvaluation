<template>
  <div class="main">
    <SearchBar v-model="searchQuery" />
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
import SearchBar from '../components/SearchBar.vue';
import ProductPreview from '../components/ProductPreview.vue';
import { url, port } from '../../serverip';

export default {
  components: {
    SearchBar,
    ProductPreview,
  },
  setup() {
    const searchQuery = ref('');
    const items = ref([]);

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
