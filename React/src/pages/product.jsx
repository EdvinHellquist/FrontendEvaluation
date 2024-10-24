import React from 'react';
import { useParams } from 'react-router-dom';

const items = [
  { id: 1, name: 'Item 1', description: 'Description of Item 1', details: 'More details about Item 1' },
  { id: 2, name: 'Item 2', description: 'Description of Item 2', details: 'More details about Item 2' },
  { id: 3, name: 'Item 3', description: 'Description of Item 3', details: 'More details about Item 3' },
  { id: 4, name: 'Item 4', description: 'Description of Item 4', details: 'More details about Item 4' },
];

export default function Product() {
  const { id } = useParams();
  const item = items.find(i => i.id === parseInt(id));
  if (!item) {
    return <p>Item not found</p>;
  }

  return (
    <div>
      {/*gör till komponent*/ }
      <h2>{item.name}</h2>
      <p>{item.details}</p>
    </div>
  );
}