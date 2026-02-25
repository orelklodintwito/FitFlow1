import { useEffect, useState } from "react";

// custom hook for fetching data from our API
// returns { data, loading, error } so the component can handle each state
export function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return; // skip if no url provided

    setLoading(true);
    setError(null);

    // NOTE: BASE_URL is hardcoded to the production server.
    // the commented-out code below would switch between prod/dev automatically.
    // might want to bring that back so you don't hit production during development
    // const BASE_URL = import.meta.env.PROD
    //   ? "https://fitflow1.onrender.com"
    //   : "http://localhost:5000";
    const BASE_URL = "https://fitflow1.onrender.com";
    const fullUrl = `${BASE_URL}${url}`;

    // abort controller - cancels the fetch if the component unmounts
    // prevents "setState on unmounted component" warnings
    const controller = new AbortController();

    if (!import.meta.env.PROD) {
      console.log("useApi fetch:", { fullUrl });
    }

    fetch(fullUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network error: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        // ignore abort errors - they happen naturally on unmount
        if (err.name === "AbortError") return;
        console.error("useApi error:", err);
        setError(err.message);
        setLoading(false);
      });

    // cleanup - abort fetch if url changes or component unmounts
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}