// src/admin/components/PopularChallengesCard.jsx
import "../admin.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// register the chart.js components we need for the doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend);

// displays a card showing challenge popularity stats:
// - percentage of users who started a challenge
// - doughnut chart breaking down which challenges were chosen
// - the most popular challenge highlighted at the bottom
function PopularChallengesCard({
  percentage = 0,
  counts = {},       // e.g. { "75 Hard": 12, "30 Day": 8 }
  mostSelected = null,
}) {
  const labels = Object.keys(counts);
  const values = Object.values(counts);

  // chart.js data config for the doughnut
  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#89c6b0",
          "#5d9adb",
          "#e6b4ef",
          "#ecd790",
        ],
        borderWidth: 0,
      },
    ],
  };

  // chart.js display options
  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#ccc",
          boxWidth: 12,
          padding: 12,
        },
      },
    },
    cutout: "65%", // makes it a doughnut instead of a full pie
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Challenges Popularity</h3>

      <div className="admin-card-content split">
        {/* left side - the overall percentage */}
        <div className="admin-card-left">
          <p className="admin-big-number">{percentage}%</p>
          <p className="admin-muted">of users started a challenge</p>
        </div>

        {/* right side - doughnut chart, or fallback text if no data */}
        <div className="admin-card-right admin-chart-wrapper">
          {values.length > 0 ? (
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
              No challenges started yet
            </p>
          )}
        </div>
      </div>

      {/* highlight the most selected challenge at the bottom */}
      <p className="admin-highlight">
        ⭐ Most Selected Challenge:{" "}
        <strong>{mostSelected || "N/A"}</strong>
      </p>
    </div>
  );
}

export default PopularChallengesCard;