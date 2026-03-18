"use client";

import { Badge } from "./ui/badge";
import {
  getVehicleData,
  isEligible,
  getNextEligibleDate,
} from "@/lib/fuel-utils";
import { CheckCircle2, XCircle, Droplet, CalendarDays, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodayStatusProps {
  vehicleNumber: string;
}

export function TodayStatus({ vehicleNumber }: TodayStatusProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const vehicleData = getVehicleData(vehicleNumber);
  const canPumpToday = isEligible(vehicleNumber, today);
  const nextEligibleDate = getNextEligibleDate(vehicleNumber);

  if (!vehicleData) return null;

  const remaining = vehicleData.quota - vehicleData.used;
  const daysUntilNext =
    nextEligibleDate && canPumpToday === false
      ? Math.ceil(
          (nextEligibleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-3xl border p-1 sm:p-2 transition-all shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)]",
        canPumpToday 
          ? "bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-teal-500/10 border-emerald-500/30 dark:from-emerald-950/50 dark:via-background dark:to-teal-950/30" 
          : "bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-orange-500/10 border-rose-500/30 dark:from-rose-950/50 dark:via-background dark:to-orange-950/30"
      )}
    >
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-background/5 blur-3xl" />
      
      <div className={cn(
        "relative rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-md",
        "bg-card/70 dark:bg-card/40 border border-background/20"
      )}>
        <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="flex items-start md:items-center gap-4 md:gap-5">
            <div className={cn(
              "flex items-center justify-center p-4 rounded-2xl shrink-0 shadow-inner",
              canPumpToday 
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-500/30" 
                : "bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-rose-500/30"
            )}>
              {canPumpToday ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <XCircle className="h-8 w-8" />
              )}
            </div>
            <div className="space-y-1">
              <h2 className={cn(
                "text-2xl md:text-3xl font-bold tracking-tight",
                canPumpToday ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
              )}>
                {canPumpToday ? "You Can Pump Today" : "Not Allowed Today"}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                {canPumpToday
                  ? "Eligible vehicles can get fuel now"
                  : `Come back in ${daysUntilNext} day${daysUntilNext !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col lg:flex-row gap-3 md:gap-4 shrink-0 mt-2 md:mt-0">
            <div className="flex-1 md:flex-none flex items-center gap-3 p-3 px-4 rounded-xl bg-background/80 border border-border/50 shadow-sm transition-transform hover:scale-[1.02]">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Droplet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Remaining</p>
                <div className="text-lg font-bold">{remaining}L</div>
              </div>
            </div>

            {nextEligibleDate && (
              <div className="flex-1 md:flex-none flex items-center gap-3 p-3 px-4 rounded-xl bg-background/80 border border-border/50 shadow-sm transition-transform hover:scale-[1.02]">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Date</p>
                  <div className="text-sm font-bold">
                    {nextEligibleDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {remaining <= 3 && canPumpToday && (
          <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-semibold">
              Warning: Only {remaining}L remaining in your quota. You're running low!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
