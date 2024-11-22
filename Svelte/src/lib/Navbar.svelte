<script>
  import { goto } from '$app/navigation';
  import reactLogo from '../assets/SvelteLogo.svg';
  import profile from '../assets/user-regular.svg';
</script>

<style>
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

<nav class="navbar">
  <a href="/" class="navbar-logo" on:click|preventDefault={() => goto('/')}>
    <img src={reactLogo} alt="Home" class="logo" />
  </a>

  <!-- Profile Icon -->
  <div class="navbar-profile">
    <a href="/profile" on:click|preventDefault={() => goto('/profile')}>
      <img src={profile} alt="Profile" class="profile-icon" />
    </a>
  </div>
</nav>
