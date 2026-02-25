import "../admin.css";
import MiniStatBar from "./MiniStatBar";

// displays a card with the average height of all users
// uses MiniStatBar for the visual bar instead of BmiBar
function AvgHeightCard({ data = {} }) {
  // safe defaults if data is missing
  const percentage = data?.percentage ?? 0;
  const value = data?.value ?? 0;
  const unit = data?.unit ?? ""; // e.g. "cm" or "ft"

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Average Height</h3>

      {/* the average value with its unit displayed next to it */}
      <p className="admin-big-number">
        {value}
        <span className="admin-unit">{unit}</span>
      </p>

      <p className="admin-muted">user average</p>

      <div className="admin-card-bottom">
        {/* visual bar with indicator - same pattern as AvgBmiCard
            but using MiniStatBar with custom gradient colors */}
        <div className="bmi-bar-wrapper">
          <MiniStatBar
            percentage={percentage}
            colors={["#BEE7E8", "#A8E6CF"]}
          />
          {/* the little marker showing where the average sits on the bar */}
          <div
            className="bmi-indicator"
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default AvgHeightCard;