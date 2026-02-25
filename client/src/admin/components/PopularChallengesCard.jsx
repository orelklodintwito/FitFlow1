// src/admin/components/PopularChallengesCard.jsx
import "../admin.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PopularChallengesCard({
  percentage = 0,
  counts = {},
  mostSelected = null,
}) {
  const labels = Object.keys(counts);
  const values = Object.values(counts);

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
    cutout: "65%",
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Challenges Popularity</h3>

      <div className="admin-card-content split">
        <div className="admin-card-left">
          <p className="admin-big-number">{percentage}%</p>
          <p className="admin-muted">of users started a challenge</p>
        </div>

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

      <p className="admin-highlight">
        ⭐ Most Selected Challenge:{" "}
        <strong>{mostSelected || "N/A"}</strong>
      </p>
    </div>
  );
}

export default PopularChallengesCard;