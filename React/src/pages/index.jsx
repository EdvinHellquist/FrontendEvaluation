import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import SearchBar from "../components/searchBar";
import ProductPreview from "../components/productpreview";
import {url, port} from '../../serverip'
 /**hämta från server */

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState();
  const [filteredItems, setFilteredItems] = useState();
  useEffect(()=> {
    async function fetchItems() {
      console.log(url + ':' + port + '/shop/products');
      const response = await fetch(url + ':' + port + '/shop/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'appliaction/json'
        },
      });
      if(response.ok) {
        if(!ignore) {
          const result = await response.json();
          console.log(result);
          setItems(result)
        }
      } else {
        console.error("Error");
      }
      
    }
    let ignore = false;
    fetchItems();
    return () => {
      ignore = true;
    }
  },[])
  // Filter items based on the search query
   useEffect(() => {
    let filteredItems;
    if(items) {
      filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredItems(filteredItems);
  },[items, searchQuery])
  
  return (
    <div>
      <Navbar/>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="item-grid">
      {/*gör till komponent*/ }
        <div className="item-grid">
           {filteredItems ? (
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
