import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ padding: '1rem', backgroundColor: '#f1f1f1', textAlign: 'center' }}>
      <Link to="/contact">Contact Us</Link>
    </footer>
  );
}