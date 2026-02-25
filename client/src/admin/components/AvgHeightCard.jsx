import "../admin.css";
import MiniStatBar from "./MiniStatBar";

function AvgHeightCard({ data = {} }) {
  const percentage = data?.percentage ?? 0;
  const value = data?.value ?? 0;
  const unit = data?.unit ?? "";

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Average Height</h3>

      <p className="admin-big-number">
        {value}
        <span className="admin-unit">{unit}</span>
      </p>

      <p className="admin-muted">user average</p>

      <div className="admin-card-bottom">
        <div className="bmi-bar-wrapper">
          <MiniStatBar
            percentage={percentage}
            colors={["#BEE7E8", "#A8E6CF"]}
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

export default AvgHeightCard;