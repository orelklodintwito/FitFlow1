// src/admin/components/PopularMealsCard.jsx
import "../admin.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// displays a card with meal logging stats:
// - total number of meal logs
// - doughnut chart (currently just one segment)
// - the most frequently logged meal
function PopularMealsCard({
  totalMeals = 0,
  mostLogged = null,
}) {
  const hasData = totalMeals > 0;

  // NOTE: right now there's only one segment ("Logged Meals") in the doughnut,
  // so it just renders as a full circle. a doughnut chart makes more sense
  // when there are multiple categories to compare (like in PopularChallengesCard).
  // if you want a breakdown by meal type, you'd need to pass something like
  // { breakfast: 40, lunch: 35, dinner: 25 } instead of just totalMeals
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
        {/* left side - total meal logs count */}
        <div className="admin-card-left">
          <p className="admin-big-number">{totalMeals}</p>
          <p className="admin-muted">total logs</p>
        </div>

        {/* right side - doughnut or fallback */}
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

      {/* most popular meal at the bottom */}
      <p className="admin-highlight">
        🍽️ Most Logged Meal:{" "}
        <strong>{mostLogged || "N/A"}</strong>
      </p>
    </div>
  );
}

export default PopularMealsCard;