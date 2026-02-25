import "../admin.css";
import MiniStatBar from "./MiniStatBar";

// displays a card with the average weight of all users
// same structure as AvgHeightCard, just different colors and title
function AvgWeightCard({ data = {} }) {
  // safe defaults if data is missing
  const percentage = data?.percentage ?? 0;
  const value = data?.value ?? 0;
  const unit = data?.unit ?? ""; // e.g. "kg" or "lbs"

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Average Weight</h3>

      {/* average value with unit */}
      <p className="admin-big-number">
        {value}
        <span className="admin-unit">{unit}</span>
      </p>

      <p className="admin-muted">user average</p>

      <div className="admin-card-bottom">
        {/* visual bar - warm colors (orange to pink) to differentiate from height card */}
        <div className="bmi-bar-wrapper">
          <MiniStatBar
            percentage={percentage}
            colors={["#FFD3B6", "#FFAAA5"]}
          />
          <div
            className="bmi-indicator"
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default AvgWeightCard;