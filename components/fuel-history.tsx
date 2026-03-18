"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getFuelHistory } from "@/lib/fuel-utils";
import { Droplet, Calendar, Filter } from "lucide-react";

interface FuelHistoryProps {
  vehicleNumber: string;
}

export function FuelHistory({ vehicleNumber }: FuelHistoryProps) {
  const history = getFuelHistory(vehicleNumber);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fuel History</CardTitle>
          <CardDescription>No fuel entries yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Droplet className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No fuel entries recorded for this vehicle
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get this week and this month data
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const thisWeekEntries = history.filter((entry) => entry.dateObj >= weekStart && entry.dateObj <= today);
  const thisMonthEntries = history.filter((entry) => entry.dateObj >= monthStart && entry.dateObj <= today);

  const getSortedData = (entries: typeof history) => {
    return sortOrder === "newest" ? entries : [...entries].reverse();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Fuel History
        </CardTitle>
        <CardDescription>
          {history.length} fuel entr{history.length === 1 ? "y" : "ies"} recorded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All ({history.length})</TabsTrigger>
            <TabsTrigger value="week">This Week ({thisWeekEntries.length})</TabsTrigger>
            <TabsTrigger value="month">This Month ({thisMonthEntries.length})</TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Filter className="h-4 w-4" />
              <span>Sort: </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                className="px-2 py-1 rounded border border-border bg-background text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <TabsContent value="all">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getSortedData(history).map((entry) => (
                <FuelHistoryEntry key={entry.date} entry={entry} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="week">
            {thisWeekEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No fuel entries this week</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getSortedData(thisWeekEntries).map((entry) => (
                  <FuelHistoryEntry key={entry.date} entry={entry} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="month">
            {thisMonthEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No fuel entries this month</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getSortedData(thisMonthEntries).map((entry) => (
                  <FuelHistoryEntry key={entry.date} entry={entry} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface FuelHistoryEntryProps {
  entry: ReturnType<typeof getFuelHistory>[0];
}

function FuelHistoryEntry({ entry }: FuelHistoryEntryProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-medium text-sm">
            {entry.dateObj.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {entry.dateObj.toLocaleDateString()}
          </div>
        </div>
      </div>
      <Badge variant="secondary" className="text-base">
        <Droplet className="h-3 w-3 mr-1" />
        {entry.liters}L
      </Badge>
    </div>
  );
}
