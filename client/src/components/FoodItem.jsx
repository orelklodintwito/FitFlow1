function FoodItem({ item, onAdd }) {
  const name = item.product_name || "Unknown product";
  const calories = item.nutriments?.["energy-kcal_100g"] ?? "N/A";
  const img =
    item.image_front_small_url ||
    item.image_url ||
    "https://via.placeholder.com/100";

  return (
    <div className="food-card">
      <div className="food-text">
        <strong>{name}</strong>
        <p>Calories: {calories}</p>
        {onAdd && (
          <button className="add-food-btn" onClick={onAdd}>
            Add
          </button>
        )}
      </div>

      <img src={img} className="food-image" alt={name} />
    </div>
  );
}

export default FoodItem;
