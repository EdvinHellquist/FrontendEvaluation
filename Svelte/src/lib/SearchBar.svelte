<script>
  export let searchQuery = '';
</script>

<style>
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

<div class="search-bar">
  <input
    type="text"
    placeholder="Search items..."
    bind:value={searchQuery}
  />
</div>
