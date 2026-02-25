import "../admin.css";
import BmiBar from "./BmiBar";

function AvgBmiCard({ data = {} }) {
  const percentage = data?.percentage ?? 0;
  const value = data?.value ?? 0;

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Average BMI</h3>

      <p className="admin-big-number">{value}</p>

      <div className="admin-bmi-labels">
        <span>Under</span>
        <span>Normal</span>
        <span>Over</span>
      </div>

      <div className="bmi-bar-wrapper">
        <BmiBar percentage={percentage} />
        <div
          className="bmi-indicator"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default AvgBmiCard;