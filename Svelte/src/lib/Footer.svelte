<script>
  import { goto } from '$app/navigation';
</script>

<style>
  footer {
    padding: 1rem;
    background-color: #f1f1f1;
    text-align: center;
  }

  a {
    text-decoration: none;
    color: #007BFF;
  }

  a:hover {
    text-decoration: underline;
  }
</style>

<footer>
  <a href="/contact" on:click|preventDefault={() => goto('/contact')}>Contact Us</a>
</footer>
