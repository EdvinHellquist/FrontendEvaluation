<template>
  <div class="item">
    <router-link :to="`/details/${id}`">
      <h3>{{ name }}</h3>
      <p>{{ description }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'ProductPreview',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>

.item {
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
  font-family: sans-serif;
}

.item:hover {
  transform: translateY(-4px); 
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.item a {
  text-decoration: none;
  color: inherit; 
}

.item h3 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 8px;
}

.item p {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}
</style>
