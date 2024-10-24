import React, { useState } from 'react';
import '../css/profile.css';
import Navbar from '../components/navbar';

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <div>
      <Navbar></Navbar>
      {isLoggedIn ? (
        <div className="profile-form">
          <h2>Update Profile</h2>
          <form>
            <div>
              <label htmlFor="billingAddress">Billing Address</label>
              <input type="text" id="billingAddress" placeholder="Enter new billing address" />
            </div>
            <div>
              <label htmlFor="password">New Password</label>
              <input type="password" id="password" placeholder="Enter new password" />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>
      ) : (
        <div className="auth-form">
          <h2>Login or Register</h2>
          <form>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" />
            </div>
            <button type="submit">Login</button>
          </form>
          <p>Don’t have an account? <button onClick={() => alert('Redirect to registration')}>Register</button></p>
        </div>
      )}
      <button onClick={toggleLogin}>
        {isLoggedIn ? 'Log Out' : 'Log In (for testing)'}
      </button>
    </div>
  );
}
