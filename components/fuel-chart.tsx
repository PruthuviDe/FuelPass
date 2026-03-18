"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { getFuelHistory } from "@/lib/fuel-utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface FuelChartProps {
  vehicleNumber: string;
}

export function FuelChart({ vehicleNumber }: FuelChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const history = getFuelHistory(vehicleNumber);
  
  // Debug: Log history data
  useEffect(() => {
    console.log('Fuel history for', vehicleNumber, ':', history);
  }, [history, vehicleNumber]);

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fuel Usage Chart</CardTitle>
          <CardDescription>Visual trends of your fuel consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <p>Loading chart...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fuel Usage Chart</CardTitle>
          <CardDescription>Visual trends of your fuel consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>No fuel data available yet. Add some fuel entries to see charts.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data - last 7 entries
  const chartData = history
    .slice(0, 7)
    .reverse()
    .map((entry, index) => ({
      id: `chart-${entry.date}`,
      date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      liters: entry.liters,
      fullDate: entry.date,
    }));

  // Weekly data - group by week
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekData = [
    { id: "week-sun", day: "Sun", liters: 0 },
    { id: "week-mon", day: "Mon", liters: 0 },
    { id: "week-tue", day: "Tue", liters: 0 },
    { id: "week-wed", day: "Wed", liters: 0 },
    { id: "week-thu", day: "Thu", liters: 0 },
    { id: "week-fri", day: "Fri", liters: 0 },
    { id: "week-sat", day: "Sat", liters: 0 },
  ];

  history.forEach((entry) => {
    const entryDate = new Date(entry.date);
    if (entryDate >= weekStart && entryDate <= today) {
      const dayIndex = entryDate.getDay();
      weekData[dayIndex].liters += entry.liters;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Usage Chart</CardTitle>
        <CardDescription>Visual trends of your fuel consumption</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent Entries</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-4 w-full">
            <div className="w-full bg-muted/30 rounded-lg overflow-auto p-2">
              <BarChart width={Math.max(600, typeof window !== 'undefined' ? window.innerWidth - 80 : 600)} height={300} data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" />
                <XAxis 
                  dataKey="date" 
                  stroke="#a0a0a0"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#a0a0a0"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f1f1f",
                    border: "1px solid #404040",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Legend />
                <Bar
                  dataKey="liters"
                  fill="#4f9cf9"
                  radius={[8, 8, 0, 0]}
                  name="Fuel (Liters)"
                />
              </BarChart>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-4 w-full">
            <div className="w-full bg-muted/30 rounded-lg overflow-auto p-2">
              <LineChart width={Math.max(600, typeof window !== 'undefined' ? window.innerWidth - 80 : 600)} height={300} data={weekData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" />
                <XAxis 
                  dataKey="day" 
                  stroke="#a0a0a0"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#a0a0a0"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f1f1f",
                    border: "1px solid #404040",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="liters"
                  stroke="#4f9cf9"
                  dot={{ fill: "#4f9cf9", r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                  name="Fuel (Liters)"
                />
              </LineChart>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-muted-foreground mb-1">Total Entries</p>
            <p className="text-2xl font-bold">{history.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-muted-foreground mb-1">Total Pumped</p>
            <p className="text-2xl font-bold">
              {history.reduce((sum, entry) => sum + entry.liters, 0)}L
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
