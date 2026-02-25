import "./nutritionDonut.css";

// clamps a number between min and max to prevent overflow
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// displays a donut chart showing calorie consumption vs target
// the ring fills up based on percentage consumed
// color changes based on whether you're within the ±100 tolerance
function NutritionDonut({
  consumedCalories = 0,
  targetCalories = 2000,
  protein = 0,
}) {
  // calculate fill percentage, capped at 150% so the donut doesn't overflow weirdly
  const percent = clamp(
    Math.round((consumedCalories / targetCalories) * 100),
    0,
    150
  );

  // within ±100 of target = on target
  const isOk =
    consumedCalories >= targetCalories - 100 &&
    consumedCalories <= targetCalories + 100;

  // status label shown next to the donut
  const statusText = isOk
    ? "On target"
    : consumedCalories < targetCalories - 100
    ? "Below target"
    : "Above target";

  return (
    <div className="nutrition-donut-wrapper">
      {/* the donut itself - conic-gradient creates the ring fill
          blue when on target, yellow when off */}
      <div
        className="nutrition-donut"
        style={{
          background: `conic-gradient(
            ${isOk ? "#7dd3fc" : "#fbbf24"} ${percent}%,
            #2a2a2a ${percent}% 100%
          )`,
        }}
      >
        {/* center shows the actual number */}
        <div className="nutrition-donut-center">
          <strong>{consumedCalories}</strong>
          <span>kcal</span>
        </div>
      </div>

      {/* text info next to the donut */}
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