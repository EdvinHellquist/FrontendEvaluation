<script>
  import Navbar from '$lib/Navbar.svelte';
  import Footer from '$lib/Footer.svelte';
  const url = 'http://localhost';
  const port = '3004';

  let email = '';
  let message = '';
  let status = '';

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${url}:${port}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      const result = await response.json();
      if (response.ok) {
        status = 'Message sent successfully';
      } else {
        status = result.error || 'Failed to send message';
      }
    } catch (error) {
      status = 'An error occurred while sending the message';
      console.error(error);
    }
  }
</script>

<style>
  .contact-form-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.contact-form-container label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

.contact-form-container input[type="email"],
.contact-form-container textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.contact-form-container textarea {
  resize: vertical;
  min-height: 120px;
}

.contact-form-container button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.contact-form-container button:hover {
  background-color: #0056b3;
}

</style>

<div>
  <Navbar />
  <div class="contact-form-container">
    <h1>Contact Us</h1>
    <form on:submit|preventDefault={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          bind:value={email}
          required
        />
      </div>
      <div>
        <label>Message:</label>
        <textarea
          bind:value={message}
          required
        ></textarea>
      </div>
      <button type="submit">Send</button>
    </form>
    {#if status}
      <p>{status}</p>
    {/if}
  </div>
  <Footer />
</div>
