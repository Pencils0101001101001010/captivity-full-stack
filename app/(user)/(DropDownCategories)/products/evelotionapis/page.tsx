"use client";

import React, { useState } from "react";
import { getAreaTimes, getRunningServices } from "./actions";

export default function EvelotionApisPage() {
  const [areaTimes, setAreaTimes] = useState<any>(null);
  const [runningServices, setRunningServices] = useState<any>(null);

  const handleFetchAreaTimes = async () => {
    try {
      const data = await getAreaTimes();
      setAreaTimes(data);
    } catch (error) {
      console.error("Error fetching area times:", error);
    }
  };

  const handleFetchRunningServices = async () => {
    try {
      const data = await getRunningServices();
      setRunningServices(data);
    } catch (error) {
      console.error("Error fetching running services:", error);
    }
  };

  return (
    <div>
      <h1>Evelotion APIs</h1>
      <div>
        <button onClick={handleFetchAreaTimes}>Fetch Area Times</button>
        {areaTimes && <pre>{JSON.stringify(areaTimes, null, 2)}</pre>}
      </div>
      <div>
        <button onClick={handleFetchRunningServices}>
          Fetch Running Services
        </button>
        {runningServices && (
          <pre>{JSON.stringify(runningServices, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
