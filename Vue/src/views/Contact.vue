<template>
    <div class="contact-form-container">
      <h1>Contact Us</h1>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>Email:</label>
          <input
            type="email"
            v-model="email"
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            v-model="message"
            required
          ></textarea>
        </div>
        <button type="submit">Send</button>
      </form>
      <p v-if="status">{{ status }}</p>
    </div>
</template>

<script>
import { ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { url, port } from '../../serverip';

export default {
  components: {
    Navbar,
    Footer
  },
  setup() {
    const email = ref('');
    const message = ref('');
    const status = ref('');

    const handleSubmit = async () => {
      try {
        const response = await fetch(`${url}:${port}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value, message: message.value }),
        });
        const result = await response.json();
        if (response.ok) {
          status.value = 'Message sent successfully';
        } else {
          status.value = result.error || 'Failed to send message';
        }
      } catch (error) {
        status.value = 'Error occurred while sending message';
        console.error('Error:', error);
      }
    };

    return {
      email,
      message,
      status,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.contact-form-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.contact-form-container h2 {
  text-align: center;
  color: #333;
}

.contact-form-container label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

.contact-form-container input[type="text"],
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
