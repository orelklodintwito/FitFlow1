// reusable component for showing loading / error / empty states
// use it at the top of any page to handle these cases before rendering content
// status can be: "loading", "error", "empty", or anything else (renders nothing)
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

  // if status doesn't match any case, render nothing
  return null;
}

export default PageState;