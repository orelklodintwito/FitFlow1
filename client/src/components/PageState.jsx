function PageState({ status, emptyText }) {
  if (status === "loading") {
    return <div role="status">Loading...</div>;
  }

  if (status === "error") {
    return <div role="alert">Something went wrong.</div>;
  }

  if (status === "empty") {
    return <div>{emptyText || "No data yet."}</div>;
  }

  return null;
}

export default PageState;
