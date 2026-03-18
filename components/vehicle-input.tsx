"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { extractLastDigit, addVehicle } from "@/lib/fuel-utils";
import { CarFront, Plus } from "lucide-react";

interface VehicleInputProps {
  onVehicleAdded: (vehicleNumber: string) => void;
}

export function VehicleInput({ onVehicleAdded }: VehicleInputProps) {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate input
    const lastDigit = extractLastDigit(vehicleNumber);
    if (lastDigit === null) {
      setError("Please enter a valid vehicle number with at least one digit");
      return;
    }

    // Add vehicle to storage
    addVehicle(vehicleNumber);
    onVehicleAdded(vehicleNumber);
    setVehicleNumber("");
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative flex items-center shadow-sm">
          <CarFront className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter vehicle number (e.g., ABC-1234)"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="h-14 pl-12 pr-24 text-base md:text-lg border-border/80 bg-card/85 focus-visible:ring-primary/40 focus-visible:border-primary/50 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-2 h-10 px-4 rounded-lg font-medium shadow-none hover:-translate-y-0"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        {error && <p className="text-sm text-destructive font-medium ml-1">{error}</p>}
      </form>
    </div>
  );
}
