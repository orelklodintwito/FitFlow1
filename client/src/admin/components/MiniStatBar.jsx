function MiniStatBar({ percentage, colors }) {
  return (
    <div className="mini-stat-bar">
      {/* פס מילוי */}
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

      {/* סמן מיקום על הסקאלה */}
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
