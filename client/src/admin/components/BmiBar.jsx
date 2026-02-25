// renders the colored BMI bar with 5 segments representing BMI ranges
// (underweight, normal, overweight, obese, extreme)
// the indicator dot is positioned based on the percentage prop
function BmiBar({ percentage }) {
  return (
    <div className="mini-stat-bar">
      {/* each segment represents a BMI range, styled via CSS with different colors */}
      <div className="bmi-segment under" />
      <div className="bmi-segment normal" />
      <div className="bmi-segment overweight" />
      <div className="bmi-segment obese" />
      <div className="bmi-segment extreme" />

      {/* the little dot/marker that shows where the average BMI falls */}
      <div
        className="mini-stat-indicator"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
}

export default BmiBar;