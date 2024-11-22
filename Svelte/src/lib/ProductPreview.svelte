<script>
  import { goto } from '$app/navigation';

  export let id;
  export let name;
  export let description;
</script>

<style>
  
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

<div class="item">
  <a href={`/details/${id}`} on:click|preventDefault={() => goto(`/details/${id}`)}>
    <h3>{name}</h3>
    <p>{description}</p>
  </a>
</div>
