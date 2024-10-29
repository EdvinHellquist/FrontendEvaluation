import React from "react";
import Navbar from "../components/navbar";
import SearchBar from "../components/searchBar";
import { useState } from "react";
import ProductPreview from "../components/productpreview";
 /**hämta från server */
const items = [
  { id: 1, name: 'Item 1', description: 'Description of Item 1' },
  { id: 2, name: 'Item 2', description: 'Description of Item 2' },
  { id: 3, name: 'Item 3', description: 'Description of Item 3' },
  { id: 4, name: 'Item 4', description: 'Description of Item 4' },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on the search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <Navbar/>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="item-grid">
      {/*gör till komponent*/ }
        <div className="item-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <ProductPreview
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
            />
            ))
          ) : (
            <p>No items found</p> // Display a message if no items match the search
          )}
        </div>
      </div>
    </div>
  );
}
