import "./nutritionDonut.css";

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function NutritionDonut({
  consumedCalories = 0,
  targetCalories = 2000,
  protein = 0,
}) {
  const percent = clamp(
    Math.round((consumedCalories / targetCalories) * 100),
    0,
    150
  );

  const isOk =
    consumedCalories >= targetCalories - 100 &&
    consumedCalories <= targetCalories + 100;

  const statusText = isOk
    ? "On target"
    : consumedCalories < targetCalories - 100
    ? "Below target"
    : "Above target";

  return (
    <div className="nutrition-donut-wrapper">
      <div
        className="nutrition-donut"
        style={{
          background: `conic-gradient(
            ${isOk ? "#7dd3fc" : "#fbbf24"} ${percent}%,
            #2a2a2a ${percent}% 100%
          )`,
        }}
      >
        <div className="nutrition-donut-center">
          <strong>{consumedCalories}</strong>
          <span>kcal</span>
        </div>
      </div>

      <div className="nutrition-info">
        <div className="nutrition-status">{statusText}</div>
        <div className="nutrition-protein">Protein: {protein} g</div>
        <div className="nutrition-target">
          Target: {targetCalories} kcal (±100)
        </div>
      </div>
    </div>
  );
}

export default NutritionDonut;
