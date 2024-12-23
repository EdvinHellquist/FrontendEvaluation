import React from 'react';
import "../css/searchbar.css"

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}