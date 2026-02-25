import { useEffect, useState } from "react";

export function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setError(null);

// אם אנחנו בפרודקשן - משתמשים בכתובת של רנדר. 
// אם אנחנו בפיתוח - משתמשים בשרת המקומי (למשל localhost:5000)
// const BASE_URL = import.meta.env.PROD
 // ? "https://fitflow1.onrender.com"
 // : "http://localhost:5000"; 
const BASE_URL = "https://fitflow1.onrender.com";
const fullUrl = `${BASE_URL}${url}`;

    // 🔥 לוג קריטי – חייב להופיע בפרודקשן
    console.log("🔥 useApi fetch:", {
      PROD: import.meta.env.PROD,
      fullUrl,
    });

    fetch(fullUrl)
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
        console.error("❌ useApi error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
