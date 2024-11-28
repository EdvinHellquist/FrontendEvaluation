<template>
  <div>
    <div v-if="!isAuthenticated" class="auth-container">
      <h2>Login or Register</h2>
      <div class="login-form">
        <h3>Login</h3>
        <input
          type="email"
          placeholder="Email"
          v-model="loginInfo.mail"
        />
        <input
          type="password"
          placeholder="Password"
          v-model="loginInfo.password"
        />
        <button @click="handleLogin">Login</button>
      </div>
      <div class="register-form">
        <h3>Register</h3>
        <input
          type="text"
          placeholder="Name"
          v-model="registerInfo.name"
        />
        <input
          type="email"
          placeholder="Email"
          v-model="registerInfo.mail"
        />
        <input
          type="text"
          placeholder="Username"
          v-model="registerInfo.username"
        />
        <input
          type="password"
          placeholder="Password"
          v-model="registerInfo.password"
        />
        <input
          type="text"
          placeholder="Address"
          v-model="registerInfo.address"
        />
        <input
          type="number"
          placeholder="Zipcode"
          v-model="registerInfo.zipcode"
        />
        <input
          type="text"
          placeholder="City"
          v-model="registerInfo.city"
        />
        <button @click="handleRegister">Register</button>
        <p v-if="errormessage">{{ errormessage }}</p>
      </div>
    </div>

    <div v-else class="profile-container">
      <h2>Your Profile</h2>
      <form @submit.prevent="handleUpdate">
        <label>Email:</label>
        <input
          type="email"
          v-model="form.mail"
          :placeholder="user.mail"
        />
        <label>Address:</label>
        <input
          type="text"
          v-model="form.address"
          :placeholder="user.address"
        />
        <label>Zipcode:</label>
        <input
          type="text"
          v-model="form.zipcode"
          :placeholder="user.zipcode"
        />
        <label>City:</label>
        <input
          type="text"
          v-model="form.city"
          :placeholder="user.city"
        />
        <button type="submit">Update Profile</button>
      </form>
      <button @click="handleLogout">Logout</button>
      <button v-if="user.role === 'admin'" @click="handleDeleteAccount">Delete Account</button>
    </div>
  </div>
</template>

<script>
import { url, port } from '../../serverip';

export default {
  name: 'Profile',
  data() {
    return {
      isAuthenticated: false,
      user: null,
      errormessage: null,
      form: { mail: '', address: '', zipcode: '', city: '' },
      loginInfo: { mail: '', password: '' },
      registerInfo: {
        name: '',
        mail: '',
        username: '',
        password: '',
        address: '',
        zipcode: 0,
        city: ''
      }
    };
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated = true;
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch(`${url}:${port}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginInfo)
        });
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          this.isAuthenticated = true;
          this.user = data;
        } else {
          this.errormessage = data.message;
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
    async handleRegister() {
      try {
        const response = await fetch(`${url}:${port}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.registerInfo)
        });
        const data = await response.json();
        if (data.user) {
          this.loginInfo.mail = this.registerInfo.mail;
          this.loginInfo.password = this.registerInfo.password;
          await this.handleLogin();
        } else {
          this.errormessage = data.message;
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    },
    async handleUpdate() {
      this.form.address = this.form.address || this.user.address;
      this.form.city = this.form.city || this.user.city;
      this.form.mail = this.form.mail || this.user.mail;
      this.form.zipcode = this.form.zipcode || this.user.zipcode;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}:${port}/auth/update-user`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(this.form)
        });
        const data = await response.json();
        if (data.user) {
          alert('Profile updated successfully');
          this.user = data.user;
        } else {
          this.errormessage = data.message;
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    },
    handleLogout() {
      this.loginInfo = { mail: '', password: '' };
      this.form = { mail: '', address: '', zipcode: '', city: '' };
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.isAuthenticated = false;
      this.user = null;
    },
    async handleDeleteAccount() {
      const confirmed = window.confirm('Are you sure you want to delete your account?');

      if (!confirmed) return;
      const response = await fetch(`${url}:${port}/auth/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: this.user.id }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to delete account.');
          }
        })
        .then((data) => {
          alert('Account deleted successfully.');
          this.handleLogout()
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
        });
    },
  }
};
</script>

<style scoped>

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
}

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
