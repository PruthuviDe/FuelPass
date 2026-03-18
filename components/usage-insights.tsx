"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { getVehicleData, getFuelHistory } from "@/lib/fuel-utils";
import { TrendingUp, Zap, BarChart3, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsageInsightsProps {
  vehicleNumber: string;
}

export function UsageInsights({ vehicleNumber }: UsageInsightsProps) {
  const vehicleData = getVehicleData(vehicleNumber);
  const history = getFuelHistory(vehicleNumber);

  if (!vehicleData) return null;

  const { quota, used } = vehicleData;
  const remaining = quota - used;
  const usagePercent = quota > 0 ? (used / quota) * 100 : 0;
  const usagePercentage = usagePercent.toFixed(1);

  // Calculate remaining pump times (assuming average 5L per pump, or daily limit)
  const avgPump = history.length > 0 ? used / history.length : 5;
  const remainingPumps = Math.floor(remaining / avgPump);

  // Calculate average usage per visit
  const avgUsagePerVisit = history.length > 0 ? (used / history.length).toFixed(2) : "N/A";

  // Calculate this week's usage
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Get start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekUsage = history
    .filter((entry) => entry.dateObj >= weekStart)
    .reduce((sum, entry) => sum + entry.liters, 0);

  // Trend analysis
  const isUsageHigh = usagePercent > 70;
  const isUsageModerate = usagePercent > 40 && usagePercent <= 70;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Usage Insights</CardTitle>
            <CardDescription className="mt-1">Smart analytics for your fuel</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Usage Box */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-3 relative overflow-hidden">
          {/* Subtle background glow based on usage */}
          <div className={cn(
            "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -mr-10 -mt-10 rounded-full",
            isUsageHigh ? "bg-red-500" : isUsageModerate ? "bg-yellow-500" : "bg-emerald-500"
          )} />
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Overall Usage</span>
            <Badge
              variant={isUsageHigh ? "destructive" : "secondary"}
              className={cn("font-bold", 
                isUsageHigh && "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20",
                !isUsageHigh && isUsageModerate && "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20",
                !isUsageHigh && !isUsageModerate && "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
              )}
            >
              {usagePercentage}%
            </Badge>
          </div>
          <div className="w-full bg-muted-foreground/10 rounded-full h-2.5 relative z-10 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                isUsageHigh ? "bg-red-500" : isUsageModerate ? "bg-yellow-500" : "bg-emerald-500"
              )}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-muted-foreground relative z-10">
            {used}L out of {quota}L used
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Remaining Pumps */}
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
              <Zap className="h-4 w-4" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Remaining Pumps</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                {remainingPumps}x
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Avg {typeof avgUsagePerVisit === "string" ? avgUsagePerVisit : `${avgUsagePerVisit}L`}
              </p>
            </div>
          </div>

          {/* This Week Usage */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">This Week</span>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {thisWeekUsage}L
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                {history.filter((entry) => entry.dateObj >= weekStart).length} entries
              </p>
            </div>
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300">
          <div className="flex items-center gap-2 mb-1.5 font-bold text-blue-900 dark:text-blue-200">
            <Lightbulb className="h-4 w-4" />
            <p className="text-sm">Suggestion</p>
          </div>
          {usagePercent > 90 && (
            <p className="text-sm font-medium leading-relaxed">
              You're almost out! Plan your next fuel visit soon.
            </p>
          )}
          {usagePercent > 70 && usagePercent <= 90 && (
            <p className="text-sm font-medium leading-relaxed">
              You have {remaining}L left. {remainingPumps} more average pumps should do it.
            </p>
          )}
          {usagePercent <= 70 && remainingPumps > 2 && (
            <p className="text-sm font-medium leading-relaxed">
              You're doing great! You can pump {remainingPumps} more times this week.
            </p>
          )}
          {usagePercent <= 70 && remainingPumps <= 2 && (
            <p className="text-sm font-medium leading-relaxed">
              Pacing looks good, keep tracking your habits!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
