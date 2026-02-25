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

        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("userProfile");
          navigate("/", { replace: true });
        } else {
          console.error("Failed to load admin dashboard:", err);
          setData({});
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="page-wrapper dark">
        <div className="admin-empty">Loading dashboard…</div>
      </div>
    );
  }

  /* ================= SAFE DATA ACCESS ================= */
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

          <div className="grid-3">
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