"use client";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Import the styles for the progress bar

const AdminPanel = () => {
  const trackerData = {
    deletedProducts: 70,
    updatedProducts: 55,
    createdProducts: 90,
    upgradedUserRoles: 40,
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to the Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrackerCard title="Deleted Products" value={trackerData.deletedProducts} color="#ff6b6b" />
        <TrackerCard title="Updated Products" value={trackerData.updatedProducts} color="#feca57" />
        <TrackerCard title="Created Products" value={trackerData.createdProducts} color="#54a0ff" />
        <TrackerCard title="Upgraded User Roles" value={trackerData.upgradedUserRoles} color="#1dd1a1" />
      </div>
    </div>
  );
};

// TrackerCard component using CircularProgressbar with custom hex colors
const TrackerCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => {
  return (
    <div className="bg-card text-card-foreground shadow-md rounded-lg p-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="w-32 h-32">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            textColor: "#333",           // Color for the text inside the circle
            pathColor: color,            // Hex color for the progress path
            trailColor: "#e0e0e0",       // Light gray background color for the trail (behind the progress)
            textSize: "16px",            // Text size inside the circular progress bar
          })}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
