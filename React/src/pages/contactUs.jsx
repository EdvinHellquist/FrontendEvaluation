import React, { useState } from 'react';
import { url, port } from '../../serverip';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import '../css/contact.css';

export default function ContactUs() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(url + ':'+ port + '/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, message }),
    });

    const result = await response.json();
    if (response.ok) {
      setStatus('Message sent successfully');
    } else {
      setStatus(result.error || 'Failed to send message');
    }
  };

  return (
    <div>
      <Navbar></Navbar>
    <div className='contact-form-container'>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label >Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Send</button>
      </form>
      {status && <p>{status}</p>}
    </div>
    <Footer></Footer>
    </div>

  );
}
