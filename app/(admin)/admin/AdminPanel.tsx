"use client";
import React, { useEffect, useState } from "react";
import {
  Activity,
  Users,
  Box,
  ShoppingCart,
  AlertCircle,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { fetchUserStatistics } from "./actions";

type UserStats = {
  totalCustomers: number;
  pendingRegistrations: number;
  activeUserSessions: number;
  newlyUpgradedCustomers: number;
  loading: boolean;
  error: string | null;
};

const AdminPanel = () => {
  const [stats, setStats] = useState<UserStats>({
    totalCustomers: 0,
    pendingRegistrations: 0,
    activeUserSessions: 0,
    newlyUpgradedCustomers: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await fetchUserStatistics();
        if (result.success) {
          setStats({
            ...result.data,
            loading: false,
            error: null,
          });
        } else {
          setStats(prev => ({
            ...prev,
            loading: false,
            error: result.error,
          }));
        }
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: "Failed to fetch statistics",
        }));
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    gradient,
  }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    gradient: string;
  }) => (
    <Card className="transform transition-all hover:scale-105 hover:shadow-lg">
      <CardHeader
        className={`flex flex-row items-center justify-between pb-2 space-y-0 ${gradient} text-white rounded-t-lg`}
      >
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4 text-white/80" />
      </CardHeader>
      <CardContent>
        <div className="pt-4 flex flex-col">
          <span className="text-3xl font-bold tracking-tight">
            {stats.loading ? (
              <span className="text-gray-400">Loading...</span>
            ) : stats.error ? (
              <span className="text-red-500 text-sm">Error loading data</span>
            ) : typeof value === "number" ? (
              value.toLocaleString()
            ) : (
              value
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg bg-white/10 border-0 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
              <Search className="w-5 h-5 text-white/70 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 mx-auto max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            gradient="bg-gradient-to-br from-violet-500 to-violet-700"
          />
          <StatCard
            title="Pending Registrations"
            value={stats.pendingRegistrations}
            icon={ShoppingCart}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          />
          <StatCard
            title="Active Sessions"
            value={stats.activeUserSessions}
            icon={Box}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
          />
          <StatCard
            title="New Customers"
            value={stats.newlyUpgradedCustomers}
            icon={AlertCircle}
            gradient="bg-gradient-to-br from-orange-500 to-orange-700"
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <button className="p-6 text-left transition-all bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl hover:shadow-md border border-blue-200">
                <h3 className="mb-2 text-lg font-medium text-blue-700">
                  View Pending Orders
                </h3>
                <p className="text-sm text-blue-600/80">
                  Handle new customer orders
                </p>
              </button>
              <Link
                href={"/admin/products/create"}
                className="p-6 text-left transition-all bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl hover:shadow-md border border-purple-200"
              >
                <h3 className="mb-2 text-lg font-medium text-purple-700">
                  Create Product
                </h3>
                <p className="text-sm text-purple-600/80">
                  Create a new product
                </p>
              </Link>
              <button className="p-6 text-left transition-all bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-xl hover:shadow-md border border-emerald-200">
                <h3 className="mb-2 text-lg font-medium text-emerald-700">
                  Generate Report
                </h3>
                <p className="text-sm text-emerald-600/80">
                  Report to the Distributor
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {[
                {
                  title: "New order received",
                  time: "2 minutes ago",
                  description: "Order #1234 received from Customer A",
                  color: "blue",
                },
                {
                  title: "Project update",
                  time: "1 hour ago",
                  description: "Website redesign progress at 75%",
                  color: "purple",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`mt-1 p-2 rounded-full bg-${activity.color}-100`}
                  >
                    <Activity
                      className={`w-4 h-4 text-${activity.color}-500`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPanel;
