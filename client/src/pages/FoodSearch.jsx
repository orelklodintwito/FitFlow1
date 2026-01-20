// src/pages/FoodSearch.jsx
import { useState } from "react";
import FoodItem from "../client/components/FoodItem.jsx";
import { useApi } from "../client/hooks/useApi";

function FoodSearch() {
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState(null);

  // API handled ONLY by custom hook (Part 2 ✔️)
  const { data, loading, error } = useApi(url);

  const foods = data?.products || [];

  const searchFood = () => {
    if (!query.trim()) return;

    const apiUrl =
      "https://corsproxy.io/?" +
      encodeURIComponent(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=10`
      );

    setUrl(apiUrl);
  };

  return (
    <div className="page api-page">
      <h1>Food Search</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search food..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchFood}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && url && foods.length === 0 && (
        <p>No results found</p>
      )}

      <div className="food-results">
        {foods.map((item) => (
          <FoodItem
            key={item.code}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}

export default FoodSearch;
