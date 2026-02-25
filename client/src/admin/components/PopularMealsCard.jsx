// src/admin/components/PopularMealsCard.jsx
import "../admin.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PopularMealsCard({
  totalMeals = 0,
  mostLogged = null,
}) {
  const hasData = totalMeals > 0;

  const chartData = {
    labels: hasData ? ["Logged Meals"] : [],
    datasets: [
      {
        data: hasData ? [totalMeals] : [],
        backgroundColor: ["#e8ac78"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: { color: "#ccc", boxWidth: 12, padding: 12 },
      },
    },
    cutout: "65%",
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Meals Popularity</h3>

      <div className="admin-card-content split">
        <div className="admin-card-left">
          <p className="admin-big-number">{totalMeals}</p>
          <p className="admin-muted">total logs</p>
        </div>

        <div className="admin-card-right admin-chart-wrapper">
          {hasData ? (
            <Doughnut
              data={chartData}
              options={{
                ...options,
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          ) : (
            <p className="admin-muted">
              No meals logged yet
            </p>
          )}
        </div>
      </div>

      <p className="admin-highlight">
        🍽️ Most Logged Meal:{" "}
        <strong>{mostLogged || "N/A"}</strong>
      </p>
    </div>
  );
}

export default PopularMealsCard;