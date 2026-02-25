// src/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../admin/admin.css";

// components
import AdminKpiRow from "./components/AdminKpiRow";
import AdminRecentActivity from "./components/AdminRecentActivity";
import PopularChallengesCard from "./components/PopularChallengesCard";
import PopularMealsCard from "./components/PopularMealsCard";
import AvgBmiCard from "./components/AvgBmiCard";
import AvgHeightCard from "./components/AvgHeightCard";
import AvgWeightCard from "./components/AvgWeightCard";

// main admin dashboard page - fetches all stats from the server and displays them
function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ===================== FETCH DASHBOARD DATA ===================== */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setData(res?.data ?? {});
      } catch (err) {
        const status = err?.response?.status;

        // if unauthorized or forbidden - clear auth and redirect to login
        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("userProfile");
          navigate("/", { replace: true });
        } else {
          console.error("Failed to load admin dashboard:", err);
          setData({}); // set empty object so the page still renders
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // show loading state while fetching
  if (loading) {
    return (
      <div className="page-wrapper dark">
        <div className="admin-empty">Loading dashboard…</div>
      </div>
    );
  }

  /* ================= SAFE DATA ACCESS ================= */
  // using ?? to avoid crashes if backend returns partial data
  const kpis = data?.kpis ?? {};
  const recentActivity = data?.recentActivity ?? [];
  const popularChoices = data?.popularChoices ?? {};
  const healthStats = data?.healthStats ?? {};

  return (
    <div className="page-wrapper dark">
      <div className="page-content">
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* ================= TOP KPIs ================= */}
        <AdminKpiRow kpis={kpis} />

        {/* ================= RECENT ACTIVITY ================= */}
        <AdminRecentActivity items={recentActivity} />

        {/* ================= POPULAR USER CHOICES ================= */}
        <section className="admin-section">
          <h2 className="admin-section-title">
            Popular User Choices
          </h2>

          {/* NOTE: using "grid-2" here but "admin-grid-2" is what's defined
              in admin.css - might want to check this matches your CSS class */}
          <div className="grid-2">
            <PopularChallengesCard
              percentage={popularChoices?.challengePercentage ?? 0}
              counts={popularChoices?.challengeCounts ?? {}}
              mostSelected={popularChoices?.mostSelectedChallenge ?? null}
            />

            <PopularMealsCard
              totalMeals={popularChoices?.totalMeals ?? 0}
              mostLogged={popularChoices?.mostLoggedMeal ?? null}
            />
          </div>
        </section>

        {/* ================= USER HEALTH & PROFILE ================= */}
        <section className="admin-section">
          <h2 className="admin-section-title">
            User Health & Profile Averages
          </h2>

          {/* NOTE: same thing here - "grid-3" isn't defined in admin.css,
              you have "admin-grid-4" and "admin-grid-2" but no "grid-3".
              might need to add it or use an existing one */}
          <div className="grid-3">
            {/* NOTE: AvgBmiCard/AvgHeightCard/AvgWeightCard expect an object
                like { value, percentage, unit } but healthStats?.averageBMI
                might be just a number (0). if the backend sends an object
                this is fine, but if it sends a number the cards will show 0
                for everything because data?.value will be undefined */}
            <AvgBmiCard
              data={healthStats?.averageBMI ?? 0}
            />
            <AvgHeightCard
              data={healthStats?.averageHeight ?? 0}
            />
            <AvgWeightCard
              data={healthStats?.averageWeight ?? 0}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;