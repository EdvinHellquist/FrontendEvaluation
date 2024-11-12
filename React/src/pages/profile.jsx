import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';
import { url, port } from '../../serverip';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function Profile() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [errormessage, setErrormessage] = useState(null);
  const [form, setForm] = useState({ mail: '', address: '', zipcode: '', city: '' });
  const [loginInfo, setLoginInfo] = useState({ mail: '', password: '' });
  const [registerInfo, setRegisterInfo] = useState({ name: '', mail: '', username: '', password: '', address: '', zipcode: 0, city: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to call an API to validate token and get user data
      setIsAuthenticated(true);
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(url + ':'+ port + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      });
      const data = await response.json();
      console.log(data);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setIsAuthenticated(true);
        setUser(data);
      } else {
        setErrormessage(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleRegister = async () => {
    console.log(registerInfo);
    console.log(url + ':'+ port +'/auth/register');
    try {
      const response = await fetch(url + ':'+ port +'/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerInfo),
      });
      const data = await response.json();
      if (data.user) {
        setLoginInfo({mail: registerInfo.mail, password: registerInfo.password});
        await handleLogin();
      } else {
        setErrormessage(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleUpdate = async () => {
    if(!form.address) form.address = user.address;
    if(!form.city) form.city = user.city;
    if(!form.mail) form.mail = user.mail;
    if(!form.zipcode) form.zipcode = user.zipcode;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url + ':'+ port +'/auth/update-user', {
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
        setUser(data.user);
      } else {
        setErrormessage(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    setLoginInfo({ mail: '', password: '' });
    setForm({ name: '', mail: '', username: '', password: '', address: '', zipcode: 0, city: '' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Navbar/>
        <div className="auth-container">
        <h2>Login or Register</h2>
        <div className="login-form">
          <h3>Login</h3>
          <input
            type="email"
            placeholder="Email"
            value={loginInfo.mail}
            onChange={(e) => setLoginInfo({ ...loginInfo, mail: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginInfo.password}
            onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
        <div className="register-form">
          <h3>Register</h3>
          <input
            type="text"
            placeholder="Name"
            value={registerInfo.name}
            onChange={(e) => setRegisterInfo({ ...registerInfo, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={registerInfo.mail}
            onChange={(e) => setRegisterInfo({ ...registerInfo, mail: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            value={registerInfo.username}
            onChange={(e) => setRegisterInfo({ ...registerInfo, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={registerInfo.password}
            onChange={(e) => setRegisterInfo({ ...registerInfo, password: e.target.value })}
          />
          <input
            type="text"
            placeholder="Adress"
            value={registerInfo.address}
            onChange={(e) => setRegisterInfo({ ...registerInfo, address: e.target.value })}
          />
          <input
            type="number"
            placeholder="Zipcode"
            value={registerInfo.zipcode}
            onChange={(e) => setRegisterInfo({ ...registerInfo, zipcode: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            value={registerInfo.city}
            onChange={(e) => setRegisterInfo({ ...registerInfo, city: e.target.value })}
          />
          <button onClick={handleRegister}>Register</button>
          <>{errormessage}</>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div className="profile-container">
        <h2>Your Profile</h2>
        <form>
          <label>Email:</label>
          <input type="email" name="mail" placeholder={user.mail} value={form.mail} onChange={(e) => setForm({ ...form, mail: e.target.value })} />
          <label>Address:</label>
          <input type="text" name="address" placeholder={user.address} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <label>Zipcode:</label>
          <input type="text" name="zipcode" placeholder={user.zipcode} value={form.zipcode} onChange={(e) => setForm({ ...form, zipcode: e.target.value })} />
          <label>City:</label>
          <input type="text" name="city" placeholder={user.city} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <button type="button" onClick={handleUpdate}>Update Profile</button>
        </form>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <Footer></Footer>
    </div>
    
  );
}
