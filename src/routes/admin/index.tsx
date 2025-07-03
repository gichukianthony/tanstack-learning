import { createFileRoute } from '@tanstack/react-router'
import {
  Users,
  Wrench,
  Car,
  Activity,
  BarChart2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { UseMonitoring } from "@/hooks/monitoring";
import { authActions } from '@/stores/authStore';
import { useLogin } from '../../hooks/useLogin';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})
const COLORS = ["#3b82f6", "#22c55e", "#f59e42", "#a78bfa"];

function RouteComponent() {
  const { data, isLoading, error } = UseMonitoring();
  // Handle both array and object responses
  const metrics = Array.isArray(data) ? data[0] : data;

  const monitoringData = [
    { label: "Active Users", value: metrics?.activeUsers ?? "-", icon: Users, color: "bg-blue-500" },
    { label: "Active Mechanics", value: metrics?.activeMechanics ?? "-", icon: Wrench, color: "bg-green-500" },
    { label: "Total Services", value: metrics?.totalServices ?? "-", icon: Car, color: "bg-yellow-500" },
    { label: "Total Feedbacks", value: metrics?.totalFeedbacks ?? "-", icon: Activity, color: "bg-pink-500" },
  ];

  const chartData = [
    { name: "Active Users", value: metrics?.activeUsers ?? 0 },
    { name: "Active Mechanics", value: metrics?.activeMechanics ?? 0 },
    { name: "Total Services", value: metrics?.totalServices ?? 0 },
    { name: "Total Feedbacks", value: metrics?.totalFeedbacks ?? 0 },
  ];

  if (isLoading) {
    return <div className="p-4">Loading monitoring data...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">Error loading monitoring data</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Welcome to the Admin Dashboard</h1>
      <p className="mt-2 text-gray-600 mb-8">Start managing your system from here.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {monitoringData.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center p-6 rounded-xl shadow-lg ${item.color} text-white transform transition-transform duration-300 hover:scale-105 animate-fade-in`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="mr-4 text-4xl animate-bounce-slow">
                <Icon />
              </div>
              <div>
                <div className="text-lg font-bold">{item.value}</div>
                <div className="text-sm">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="text-blue-500" /> System Metrics Bar Chart
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="text-blue-500" /> System Metrics Pie Chart
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

