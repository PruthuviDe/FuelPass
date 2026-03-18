"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { isEligible, isSameDay } from "@/lib/fuel-utils";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  vehicleNumber: string;
  onDateClick: (date: Date) => void;
}

export function Calendar({ vehicleNumber, onDateClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get first day of month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Get last day of month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Get starting day of week (0 = Sunday)
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get number of days in month
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const days: (Date | null)[] = [];
  
  // Add empty slots for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (date: Date) => {
    const eligible = isEligible(vehicleNumber, date);
    if (eligible) {
      onDateClick(date);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-8 w-8 rounded-lg bg-background/50">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8 rounded-lg bg-background/50">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground p-1 sm:p-2"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} />;
            }

            const eligible = isEligible(vehicleNumber, date);
            const isToday = isSameDay(date, today);
            const isPast = date < today;

            return (
              <button
                key={index}
                onClick={() => handleDayClick(date)}
                disabled={!eligible || isPast}
                className={cn(
                  "relative aspect-square rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200",
                  "flex items-center justify-center",
                  eligible && !isPast
                    ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400 cursor-pointer shadow-sm border border-emerald-500/20"
                    : "bg-rose-500/5 text-rose-700/50 dark:text-rose-400/50 cursor-not-allowed opacity-60",
                  isPast && "opacity-30 grayscale saturate-50",
                  isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background font-bold text-primary",
                  !isPast && eligible && "active:scale-95"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
        
        <div className="mt-auto pt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground justify-center sm:justify-start">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500/30" />
            <span>Allowed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-rose-500/10" />
            <span>Not Allowed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md ring-2 ring-primary" />
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
