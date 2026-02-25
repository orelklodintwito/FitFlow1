// renders a simple progress-style bar with a gradient fill and position indicator
// used by AvgHeightCard and AvgWeightCard for the visual stat display
function MiniStatBar({ percentage, colors }) {
  return (
    <div className="mini-stat-bar">
      {/* the filled portion of the bar, width based on percentage
          gradient goes from colors[0] to colors[1] */}
      <div
        className="mini-stat-fill"
        style={{
          width: `${percentage}%`,
          background: `linear-gradient(
            90deg,
            ${colors[0]},
            ${colors[1]}
          )`,
        }}
      />

      {/* small marker showing the exact position on the bar */}
      <div
        className="mini-stat-indicator"
        style={{
          left: `${percentage}%`,
        }}
      />
    </div>
  );
}

export default MiniStatBar;