"use client";

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
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface FuelChartProps {
  vehicleNumber: string;
}

export function FuelChart({ vehicleNumber }: FuelChartProps) {
  const history = getFuelHistory(vehicleNumber);

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

          <TabsContent value="recent" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d5d5d0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666666"
                  style={{ fontSize: "12px" }}
                />
                <YAxis 
                  stroke="#666666"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e5e0",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#1c1c1a" }}
                  formatter={(value: any) => [`${value}L`, "Fuel"]}
                />
                <Legend />
                <Bar
                  dataKey="liters"
                  fill="#2955c7"
                  radius={[8, 8, 0, 0]}
                  name="Fuel (Liters)"
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d5d5d0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#666666"
                  style={{ fontSize: "12px" }}
                />
                <YAxis 
                  stroke="#666666"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e5e0",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#1c1c1a" }}
                  formatter={(value: any) => [`${value}L`, "Fuel"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="liters"
                  stroke="#2955c7"
                  dot={{ fill: "#2955c7", r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                  name="Fuel (Liters)"
                />
              </LineChart>
            </ResponsiveContainer>
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
