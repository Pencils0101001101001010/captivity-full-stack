"use server";

import axios from "axios";

const BASE_URL = "http://41.185.71.69:5000/freedom.core/Registration/Rest";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export async function getAreaTimes() {
  const response = await axiosInstance.get("/IsStarting");
  return response.data;
}

export async function getRunningServices() {
  const response = await axiosInstance.get("/GetRunningServices");
  return response.data;
}

// Add other API functions here...
