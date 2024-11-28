<template>
  <div class="search-bar">
    <input
      type="text"
      placeholder="Search items..."
      :value="searchQuery"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  computed: {
    searchQuery: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  }
};
</script>

<style scoped>
.search-bar {
  display: flex;
  margin-bottom: 20px;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.search-bar input {
  padding: 10px;
  width: 60%;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}
</style>