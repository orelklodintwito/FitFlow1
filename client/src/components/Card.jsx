// src/components/Card.jsx

// reusable card component used across the app
// can show a title, a big value, a description, and any extra content via children
function Card({ title, value, description, children }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      {/* only render value/description if they exist */}
      {value && <p className="card-value">{value}</p>}
      {description && <p className="card-description">{description}</p>}
      {/* children lets you put anything else inside the card (charts, bars, etc.) */}
      {children}
    </div>
  );
}

export default Card;