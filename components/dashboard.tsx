"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { getVehicleData, getNextEligibleDate, extractLastDigit, isEven, hasWeekPassed } from "@/lib/fuel-utils";
import { CalendarDays, Droplet, TrendingUp, RotateCcw, CarFront } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardProps {
  vehicleNumber: string;
}

export function Dashboard({ vehicleNumber }: DashboardProps) {
  const vehicleData = getVehicleData(vehicleNumber);
  const nextEligibleDate = getNextEligibleDate(vehicleNumber);
  const lastDigit = extractLastDigit(vehicleNumber);

  if (!vehicleData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>No vehicle selected</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { quota, used } = vehicleData;
  const remaining = quota - used;
  const progressPercentage = (used / quota) * 100;

  const eligibilityType = lastDigit !== null && isEven(lastDigit) ? "Even" : "Odd";

  return (
    <Card className="h-full flex flex-col pt-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Vehicle Overview</CardTitle>
              <CardDescription className="uppercase tracking-widest text-[10px] sm:text-xs font-semibold mt-1">
                {vehicleNumber} • {eligibilityType} DATES
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="flex flex-col justify-between p-4 rounded-2xl bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Used</span>
            </div>
            <div>
              <div className="text-2xl font-bold">{used}L</div>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                {progressPercentage.toFixed(0)}% of quota
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors">
            <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
              <Droplet className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Remaining</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{remaining}L</div>
              <p className="text-xs text-muted-foreground font-medium mt-1">Available fuel</p>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 rounded-2xl bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <Droplet className="h-4 w-4 opacity-50" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Quota</span>
            </div>
            <div>
              <div className="text-2xl font-bold">{quota}L</div>
              <p className="text-xs text-muted-foreground font-medium mt-1">Monthly allocation</p>
            </div>
          </div>
        </div>

        {/* Progress System */}
        <div className="space-y-3 p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-semibold">Fuel Usage</p>
              <p className="text-xs text-muted-foreground mt-1">
                {used}L out of {quota}L used
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-primary">{progressPercentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="relative h-3 w-full bg-muted overflow-hidden rounded-full">
            <div 
              className={cn(
                "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
                progressPercentage > 85 ? "bg-red-500" : progressPercentage > 60 ? "bg-yellow-500" : "bg-primary"
              )} 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }} 
            />
          </div>
        </div>

        {/* Secondary Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
          {nextEligibleDate && (
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-muted/30 border border-border/30">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Next Date</p>
                <p className="text-sm font-bold">
                  {nextEligibleDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-muted/30 border border-border/30">
            <div className={cn(
              "p-2.5 rounded-xl",
              vehicleData.lastResetDate && hasWeekPassed(vehicleData.lastResetDate) 
                ? "bg-amber-500/10 text-amber-600" 
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            )}>
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Reset Status</p>
              <p className="text-sm font-bold">
                {vehicleData.lastResetDate 
                  ? (hasWeekPassed(vehicleData.lastResetDate) ? "Due for Reset" : "Active Weekly cycle")
                  : "Auto-tracked"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
