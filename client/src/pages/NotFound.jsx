function NotFound({ goHome }) {
  return (
    <div style={{ padding: "40px", textAlign: "center", color: "white" }}>
      <h1>404 – Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button onClick={goHome} style={{ marginTop: "20px" }}>
        Go to Home
      </button>
    </div>
  );
}

export default NotFound;
