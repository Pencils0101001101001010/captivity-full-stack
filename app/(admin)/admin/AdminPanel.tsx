"use client";
import React, { useState } from "react";
import { TrackerData } from "./types";
// Import necessary components from Chart.js
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminPanel = () => {
  const [trackerData, setTrackerData] = useState<TrackerData>({
    deletedProducts: 10,
    updatedProducts: 5,
    createdProducts: 20,
    upgradedUserRoles: 3,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to the Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrackerCard
          title="Deleted Products"
          value={trackerData.deletedProducts}
          chartType="line"
        />
        <TrackerCard
          title="Updated Products"
          value={trackerData.updatedProducts}
          chartType="bar"
        />
        <TrackerCard
          title="Created Products"
          value={trackerData.createdProducts}
          chartType="pie"
        />
        <TrackerCard
          title="Upgraded User Roles"
          value={trackerData.upgradedUserRoles}
          chartType="line"
        />
      </div>
    </div>
  );
};

// TrackerCard Component with multiple chart types and fixed Pie chart
const TrackerCard = ({
  title,
  value,
  chartType,
}: {
  title: string;
  value: number;
  chartType: "line" | "bar" | "pie";
}) => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: title,
        data: [10, 15, 20, 25, 30, 35, 40], // Example static data
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor:
          chartType === "pie"
            ? ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384"]
            : "rgba(75, 192, 192, 0.2)",
        hoverBackgroundColor:
          chartType === "pie"
            ? ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384"]
            : undefined,
      },
    ],
  };

  const options = {
    maintainAspectRatio: chartType === "pie" ? false : true,
    responsive: true,
    plugins: {
      legend: {
        display: chartType === "pie" ? true : false,
        position: "bottom" as const, // Use exact literal type for position
      },
    },
    scales: {
      x: chartType !== "pie" ? { 
        ticks: { 
          maxRotation: 0, // Prevents label rotation
          minRotation: 0 
        } 
      } : undefined,
      y: chartType !== "pie" ? {
        beginAtZero: true,
      } : undefined,
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
      {/* Dynamic Chart based on chartType */}
      <div
        className={`mt-4 ${
          chartType === "pie" ? "w-60 h-60 mx-auto" : "" // Adjusted size and centered Pie chart
        }`}
      >
        {chartType === "line" && <Line data={data} options={options} />}
        {chartType === "bar" && <Bar data={data} options={options} />}
        {chartType === "pie" && <Pie data={data} options={options} />}
      </div>
    </div>
  );
};

export default AdminPanel;
