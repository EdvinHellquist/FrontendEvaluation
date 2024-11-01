import React from 'react';
import { Link } from 'react-router-dom';
import '../css/productpreview.css';

export default function ProductPreview({ id, name, description }) {
  return (
    <div className="item">
      <Link to={`/details/${id}`}>
        <h3>{name}</h3>
        <p>{description}</p>
      </Link>
    </div>
  );
}