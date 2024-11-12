import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import SearchBar from "../components/searchBar";
import ProductPreview from "../components/productpreview";
import Footer from "../components/footer";
import { url, port } from '../../serverip';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    async function fetchItems(query) {
      const endpoint = query ? `/search?q=${encodeURIComponent(query)}` : '/shop/products';
      console.log(url + ':' + port + endpoint);

      try {
        const response = await fetch(url + ':' + port + endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setItems(result.products || result);
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }

    fetchItems(searchQuery);
  }, [searchQuery]);

  return (
    <div className="main">
      <Navbar />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="item-grid">
        {items.length > 0 ? (
          items.map(item => (
            <ProductPreview
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
            />
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}
