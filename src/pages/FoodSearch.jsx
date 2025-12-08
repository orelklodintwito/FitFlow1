// src/pages/FoodSearch.jsx
import { useState } from "react";
import FoodItem from "../components/FoodItem.jsx";

function FoodSearch() {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFood = async () => {
    if (!query.trim()) return;
    setLoading(true);

    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=10`;

    const res = await fetch(url);
    const data = await res.json();

    setFoods(data.products || []);
    setLoading(false);
  };

  return (
    <div>
      <h1>Food Search</h1>

      <input
        type="text"
        placeholder="Search food..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchFood}>Search</button>

      {loading && <p>Loading...</p>}

      <div>
        {foods.map((f) => (
          <FoodItem key={f.code || Math.random()} item={f} />
        ))}
      </div>
    </div>
  );
}

export default FoodSearch;
