"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { addFuelLog, getVehicleData, formatDate, getFuelOnDate } from "@/lib/fuel-utils";
import { AlertCircle } from "lucide-react";

interface FuelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleNumber: string;
  selectedDate: Date | null;
  onFuelAdded: () => void;
}

export function FuelDialog({
  open,
  onOpenChange,
  vehicleNumber,
  selectedDate,
  onFuelAdded,
}: FuelDialogProps) {
  const [liters, setLiters] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [vehicleData, setVehicleData] = useState<{ quota: number; used: number; remaining: number; dailyLimit?: number }>({
    quota: 15,
    used: 0,
    remaining: 15,
  });
  const [fuelTodayAmount, setFuelTodayAmount] = useState(0);

  useEffect(() => {
    if (open && selectedDate) {
      const data = getVehicleData(vehicleNumber);
      if (data) {
        const remaining = data.quota - data.used;
        const dateStr = formatDate(selectedDate);
        const fuelToday = getFuelOnDate(vehicleNumber, dateStr) || 0;
        
        setVehicleData({
          quota: data.quota,
          used: data.used,
          remaining,
          dailyLimit: data.dailyLimit || 5, // Default 5L per day
        });
        setFuelTodayAmount(fuelToday);

        // Pre-fill with existing log if any
        if (fuelToday > 0) {
          setLiters(fuelToday.toString());
        } else {
          setLiters("");
        }
      }
    }
  }, [open, selectedDate, vehicleNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setWarning("");

    const amount = parseFloat(liters);

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!selectedDate) {
      setError("No date selected");
      return;
    }

    // Check daily limit
    const dailyLimit = vehicleData.dailyLimit || 5;
    if (amount > dailyLimit) {
      setWarning(`Daily limit is ${dailyLimit}L. You're trying to add ${amount}L.`);
      return;
    }

    // Check if it exceeds remaining quota
    const dateStr = formatDate(selectedDate);
    const data = getVehicleData(vehicleNumber);
    const existingLog = data?.logs[dateStr] || 0;
    const newUsed = vehicleData.used - existingLog + amount;

    if (newUsed > vehicleData.quota) {
      setError(`Exceeds quota. Remaining: ${vehicleData.remaining}L`);
      return;
    }

    const success = addFuelLog(vehicleNumber, dateStr, amount);

    if (success) {
      onFuelAdded();
      setLiters("");
      setWarning("");
      onOpenChange(false);
    } else {
      setError("Failed to add fuel log");
    }
  };

  if (!selectedDate) return null;

  const dateStr = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Fuel Entry</DialogTitle>
          <DialogDescription>{dateStr}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Quota:</span>
              <span className="font-medium">{vehicleData.quota}L</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Used:</span>
              <span className="font-medium">{vehicleData.used}L</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {vehicleData.remaining}L
              </span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2 mt-2">
              <span className="text-muted-foreground">Daily Limit:</span>
              <span className="font-medium">{vehicleData.dailyLimit}L/day</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fuel logged today:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {fuelTodayAmount}L
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="liters" className="text-sm font-medium">
                Fuel Amount (Liters)
              </label>
              <Input
                id="liters"
                type="number"
                step="0.01"
                min="0.01"
                max={vehicleData.remaining}
                placeholder="Enter liters"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                className="mt-1"
              />
            </div>
            {warning && (
              <div className="flex gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">{warning}</p>
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
