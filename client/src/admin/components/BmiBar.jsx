function BmiBar({ percentage }) {
  return (
    <div className="mini-stat-bar">
      <div className="bmi-segment under" />
      <div className="bmi-segment normal" />
      <div className="bmi-segment overweight" />
      <div className="bmi-segment obese" />
      <div className="bmi-segment extreme" />

      <div
        className="mini-stat-indicator"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
}

export default BmiBar;