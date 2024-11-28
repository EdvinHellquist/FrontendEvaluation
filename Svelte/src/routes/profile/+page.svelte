<script>
  import { onMount } from 'svelte';
  import Navbar from '$lib/Navbar.svelte';
  import Footer from '$lib/Footer.svelte';
  const url = 'http://localhost';
  const port = '3004';

  let isAuthenticated = false;
  let user = null;
  let errormessage = null;

  let form = { mail: '', address: '', zipcode: '', city: '' };
  let loginInfo = { mail: '', password: '' };
  let registerInfo = { name: '', mail: '', username: '', password: '', address: '', zipcode: 0, city: '' };

  onMount(() => {
    const token = localStorage.getItem('token');
    if (token) {
      isAuthenticated = true;
      user = JSON.parse(localStorage.getItem('user'));
    }
  });

  async function handleLogin() {
    try {
      const response = await fetch(`${url}:${port}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        isAuthenticated = true;
        user = data;
        errormessage = null;
      } else {
        errormessage = data.message;
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  async function handleRegister() {
    try {
      const response = await fetch(`${url}:${port}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerInfo),
      });
      const data = await response.json();
      if (data.user) {
        loginInfo = { mail: registerInfo.mail, password: registerInfo.password };
        await handleLogin();
      } else {
        errormessage = data.message;
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

  async function handleUpdate() {
    if (!form.address) form.address = user.address;
    if (!form.city) form.city = user.city;
    if (!form.mail) form.mail = user.mail;
    if (!form.zipcode) form.zipcode = user.zipcode;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${url}:${port}/auth/update-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.user) {
        alert('Profile updated successfully');
        user = data.user;
        errormessage = null;
      } else {
        errormessage = data.message;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    isAuthenticated = false;
    user = null;
    loginInfo = { mail: '', password: '' };
    form = { mail: '', address: '', zipcode: '', city: '' };
  }
  async function handleDeleteAccount() {
    const confirmed = window.confirm('Are you sure you want to delete your account?');

    if (!confirmed) return;

    try {
      const response = await fetch(`${url}:${port}/auth/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: user.id })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Account deleted successfully.');
        handleLogout();
      } else if (response.status === 404) {
        alert('User not found.');
      } else {
        alert('Failed to delete the account.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting the account.');
    }
  }
</script>

<style>
.auth-container,
.profile-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h2 {
  text-align: center;
  color: #333;
}

h3 {
  color: #555;
  margin-top: 0;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.auth-container .login-form,
.auth-container .register-form {
  margin-top: 20px;
}

.auth-container .login-form {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.auth-container .register-form {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.profile-container form {
  display: flex;
  flex-direction: column;
}

.profile-container button {
  margin-top: 20px;
  background-color: #28a745;
}

.profile-container button:hover {
  background-color: #218838;
}

button[type="button"] {
  background-color: #ffc107;
  color: #333;
}

button[type="button"]:hover {
  background-color: #e0a800;
}

</style>

{#if !isAuthenticated}
  <div>
    <Navbar />
    <div class="auth-container">
      <h2>Login or Register</h2>

      <div class="login-form">
        <h3>Login</h3>
        <input type="email" placeholder="Email" bind:value={loginInfo.mail} />
        <input type="password" placeholder="Password" bind:value={loginInfo.password} />
        <button on:click={handleLogin}>Login</button>
      </div>

      <div class="register-form">
        <h3>Register</h3>
        <input type="text" placeholder="Name" bind:value={registerInfo.name} />
        <input type="email" placeholder="Email" bind:value={registerInfo.mail} />
        <input type="text" placeholder="Username" bind:value={registerInfo.username} />
        <input type="password" placeholder="Password" bind:value={registerInfo.password} />
        <input type="text" placeholder="Address" bind:value={registerInfo.address} />
        <input type="number" placeholder="Zipcode" bind:value={registerInfo.zipcode} />
        <input type="text" placeholder="City" bind:value={registerInfo.city} />
        <button on:click={handleRegister}>Register</button>
        {#if errormessage}
          <p class="error">{errormessage}</p>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div>
    <Navbar />
    <div class="profile-container">
      <h2>Your Profile</h2>
      <form>
        <label>Email:</label>
        <input type="email" placeholder={user.mail} bind:value={form.mail} />
        <label>Address:</label>
        <input type="text" placeholder={user.address} bind:value={form.address} />
        <label>Zipcode:</label>
        <input type="text" placeholder={user.zipcode} bind:value={form.zipcode} />
        <label>City:</label>
        <input type="text" placeholder={user.city} bind:value={form.city} />
        <button type="button" on:click={handleUpdate}>Update Profile</button>
      </form>
      <button on:click={handleLogout}>Logout</button>
      {#if user.role === 'admin'}
        <button on:click={handleDeleteAccount}>Delete Account</button>
      {/if}
    </div>
    <Footer />
  </div>
{/if}
