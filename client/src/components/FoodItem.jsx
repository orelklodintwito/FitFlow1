// displays a single food item card (from OpenFoodFacts API results)
// shows the product name, calories per 100g, and an image
// onAdd callback is optional - if provided, shows an "Add" button
function FoodItem({ item, onAdd }) {
  const name = item.product_name || "Unknown product";
  const calories = item.nutriments?.["energy-kcal_100g"] ?? "N/A";

  // try small image first, fallback to full image, then placeholder
  const img =
    item.image_front_small_url ||
    item.image_url ||
    "https://via.placeholder.com/100";

  return (
    <div className="food-card">
      <div className="food-text">
        <strong>{name}</strong>
        <p>Calories: {calories}</p>
        {/* only show Add button if onAdd handler was passed */}
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