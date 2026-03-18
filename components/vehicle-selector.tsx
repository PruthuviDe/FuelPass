"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CarFront } from "lucide-react";

interface VehicleSelectorProps {
  vehicles: string[];
  selectedVehicle: string | null;
  onVehicleChange: (vehicle: string) => void;
}

export function VehicleSelector({
  vehicles,
  selectedVehicle,
  onVehicleChange,
}: VehicleSelectorProps) {
  if (vehicles.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-1">
      <div className="flex items-center justify-center p-2 rounded-xl bg-secondary/80 text-secondary-foreground border border-border/50">
        <CarFront className="h-5 w-5 opacity-70" />
      </div>
      <Select value={selectedVehicle || undefined} onValueChange={onVehicleChange}>
        <SelectTrigger className="w-full md:w-[240px] h-11 bg-card/60 backdrop-blur-sm border-border/80 shadow-sm rounded-xl">
          <SelectValue placeholder="Select a vehicle" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border/80 shadow-xl">
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle} value={vehicle} className="rounded-lg cursor-pointer">
              {vehicle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
