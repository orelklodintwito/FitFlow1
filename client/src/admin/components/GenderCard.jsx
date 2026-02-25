// src/admin/components/GenderCard.jsx
import "../admin.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function GenderCard({ data }) {
  const chartData = {
    labels: ["Women", "Men"],
    datasets: [
      {
        data: [data.women, data.men],
        backgroundColor: [
  "#F8BBD0", // Women - pastel pink
  "#BBDEFB", // Men - pastel blue
],

        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ccc",
          boxWidth: 12,
        },
      },
    },
    cutout: "65%",
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">
        Gender Distribution
      </h3>

      <div className="admin-card-center">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}

export default GenderCard;
