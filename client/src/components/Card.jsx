// src/components/Card.jsx
function Card({ title, value, description, children }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      {value && <p className="card-value">{value}</p>}
      {description && <p className="card-description">{description}</p>}
      {children}
    </div>
  );
}

export default Card;
