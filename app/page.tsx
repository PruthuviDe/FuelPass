"use client";

import { useState, useEffect } from "react";
import { VehicleInput } from "@/components/vehicle-input";
import { VehicleSelector } from "@/components/vehicle-selector";
import { TodayStatus } from "@/components/today-status";
import { Dashboard } from "@/components/dashboard";
import { Calendar } from "@/components/calendar";
import { FuelDialog } from "@/components/fuel-dialog";
import { FuelHistory } from "@/components/fuel-history";
import { FuelChart } from "@/components/fuel-chart";
import { UsageInsights } from "@/components/usage-insights";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAllVehicles } from "@/lib/fuel-utils";
import { Fuel } from "lucide-react";

export default function Home() {
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadedVehicles = getAllVehicles();
    setVehicles(loadedVehicles);
    if (loadedVehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(loadedVehicles[0]);
    }
  }, [refreshKey]);

  const handleVehicleAdded = (vehicleNumber: string) => {
    setVehicles([...vehicles, vehicleNumber]);
    setSelectedVehicle(vehicleNumber);
    setRefreshKey((prev) => prev + 1);
  };

  const handleVehicleChange = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleFuelAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-accent/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-lg">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary p-2 text-primary-foreground shadow-lg shadow-primary/30">
                <Fuel className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Fuel Pass</h1>
                <p className="text-sm text-muted-foreground">
                  Smart Fuel Eligibility and Usage Tracker
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative z-10 mx-auto max-w-5xl px-4 py-8 md:py-10">
        <div className="space-y-6 md:space-y-8">
          <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/85 p-6 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.55)] backdrop-blur md:p-8">
            <div className="pointer-events-none absolute -top-20 right-8 h-44 w-44 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Dashboard
                </p>
                <h2 className="text-2xl font-semibold md:text-3xl">
                  Track Fuel Eligibility in Seconds
                </h2>
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  Add your vehicle, check if you can fuel today, and monitor usage trends effortlessly in one clean, modern view.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-muted-foreground">
                  Vehicles: {vehicles.length}
                </span>
                {selectedVehicle && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 font-medium text-primary">
                    Active: {selectedVehicle}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Vehicle Input */}
          <VehicleInput onVehicleAdded={handleVehicleAdded} />

          {/* Vehicle Selector */}
          {vehicles.length > 1 && (
            <VehicleSelector
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onVehicleChange={handleVehicleChange}
            />
          )}

          {/* Today Status - Main Decision UI */}
          {selectedVehicle && (
            <TodayStatus vehicleNumber={selectedVehicle} />
          )}

          {/* Dashboard and Calendar */}
          {selectedVehicle && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
              {/* Dashboard */}
              <div>
                <Dashboard key={`dashboard-${refreshKey}`} vehicleNumber={selectedVehicle} />
              </div>

              {/* Calendar */}
              <div>
                <Calendar
                  vehicleNumber={selectedVehicle}
                  onDateClick={handleDateClick}
                />
              </div>
            </div>
          )}

          {/* Usage Insights */}
          {selectedVehicle && (
            <UsageInsights key={`insights-${refreshKey}`} vehicleNumber={selectedVehicle} />
          )}

          {/* Fuel Chart */}
          {selectedVehicle && (
            <FuelChart key={`chart-${refreshKey}`} vehicleNumber={selectedVehicle} />
          )}

          {/* Fuel History */}
          {selectedVehicle && (
            <FuelHistory key={`history-${refreshKey}`} vehicleNumber={selectedVehicle} />
          )}

          {/* No Vehicle State */}
          {vehicles.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/80 bg-card/70 p-12 text-center backdrop-blur-sm">
              <Fuel className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Vehicles Added</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add your first vehicle to start tracking fuel eligibility
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Fuel Dialog */}
      {selectedVehicle && (
        <FuelDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          vehicleNumber={selectedVehicle}
          selectedDate={selectedDate}
          onFuelAdded={handleFuelAdded}
        />
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-border/70">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Fuel Pass • Built with Next.js, React, Tailwind CSS, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}
