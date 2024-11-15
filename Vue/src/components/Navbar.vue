<template>
  <nav class="navbar">
    <router-link to="/" class="navbar-logo">
      <img src="@/assets/logo.svg" alt="Home" class="logo" />
    </router-link>

    <!-- Profile Icon -->
    <div class="navbar-profile">
      <router-link to="/profile">
        <img src="@/assets/user-regular.svg" alt="Profile" class="profile-icon" />
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  width: 90vw;
}
.navbar-logo .logo {
  height: 50px;
}

.navbar-profile .profile-icon {
  height: 40px;
  cursor: pointer;
}
</style>