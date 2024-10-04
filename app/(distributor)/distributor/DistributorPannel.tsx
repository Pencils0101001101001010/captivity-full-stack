"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, AlertCircle, TruckIcon, Package, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Dummy data for demonstration
const inventoryData = [
  { name: 'Product A', stock: 120 },
  { name: 'Product B', stock: 80 },
  { name: 'Product C', stock: 40 },
  { name: 'Product D', stock: 200 },
];

const InventoryOverview = () => (
  <Card>
    <CardHeader>
      <CardTitle>Inventory Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={inventoryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="stock" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const OrderStatus = () => (
  <Card>
    <CardHeader>
      <CardTitle>Order Status</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <Package size={24} />
        <div>
          <div className="text-2xl font-bold">24</div>
          <div className="text-sm text-gray-500">Pending Orders</div>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <TruckIcon size={24} />
        <div>
          <div className="text-2xl font-bold">18</div>
          <div className="text-sm text-gray-500">In Transit</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LowStockAlert = () => (
  <Alert>
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Low Stock Alert</AlertTitle>
    <AlertDescription>
      Product B is running low. Current stock: 80 units.
    </AlertDescription>
  </Alert>
);

const RevenueOverview = () => (
  <Card>
    <CardHeader>
      <CardTitle>Revenue Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <DollarSign size={24} />
        <div>
          <div className="text-2xl font-bold">$24,500</div>
          <div className="text-sm text-gray-500">This Month</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const DistributorDashboard = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Distributor Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InventoryOverview />
      <OrderStatus />
    </div>
    <LowStockAlert />
    <RevenueOverview />
  </div>
);

export default DistributorDashboard;