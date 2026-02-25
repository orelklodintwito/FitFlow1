import "../admin.css";
import BmiBar from "./BmiBar";

// displays a card with the average BMI of all users
// shows the numeric value and a visual bar with an indicator
function AvgBmiCard({ data = {} }) {
  // safe defaults in case data is missing or incomplete
  const percentage = data?.percentage ?? 0;
  const value = data?.value ?? 0;

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Average BMI</h3>

      {/* the actual average BMI number */}
      <p className="admin-big-number">{value}</p>

      {/* labels for the BMI ranges shown above the bar */}
      <div className="admin-bmi-labels">
        <span>Under</span>
        <span>Normal</span>
        <span>Over</span>
      </div>

      {/* visual BMI bar with a moving indicator based on the percentage.
          BmiBar renders the colored bar itself,
          bmi-indicator is the little marker that shows where the average sits */}
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