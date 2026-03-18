// Fuel tracking data structure
export interface VehicleData {
  quota: number;
  used: number;
  logs: Record<string, number>; // date -> liters
  lastResetDate?: string; // YYYY-MM-DD format
  dailyLimit?: number; // max liters per day (optional)
}

export interface FuelData {
  vehicles: Record<string, VehicleData>; // vehicleNumber -> VehicleData
}

const STORAGE_KEY = 'fuel-pass-data';

// Get data from localStorage
export function getFuelData(): FuelData {
  if (typeof window === 'undefined') {
    return { vehicles: {} };
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { vehicles: {} };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { vehicles: {} };
  }
}

// Save data to localStorage
export function saveFuelData(data: FuelData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Add or update vehicle
export function addVehicle(vehicleNumber: string): VehicleData {
  const data = getFuelData();
  
  if (!data.vehicles[vehicleNumber]) {
    data.vehicles[vehicleNumber] = {
      quota: 15,
      used: 0,
      logs: {},
    };
    saveFuelData(data);
  }
  
  return data.vehicles[vehicleNumber];
}

// Get vehicle data
export function getVehicleData(vehicleNumber: string): VehicleData | null {
  checkAndApplyWeeklyReset(vehicleNumber);
  const data = getFuelData();
  return data.vehicles[vehicleNumber] || null;
}

// Add fuel log for a specific date
export function addFuelLog(
  vehicleNumber: string,
  date: string,
  liters: number
): boolean {
  const data = getFuelData();
  const vehicle = data.vehicles[vehicleNumber];
  
  if (!vehicle) {
    return false;
  }
  
  // Check if adding this amount would exceed quota
  const currentUsed = vehicle.used;
  const dateLog = vehicle.logs[date] || 0;
  const newTotal = currentUsed - dateLog + liters;
  
  if (newTotal > vehicle.quota) {
    return false;
  }
  
  // Update log and total used
  vehicle.logs[date] = liters;
  vehicle.used = Object.values(vehicle.logs).reduce((sum, val) => sum + val, 0);
  
  saveFuelData(data);
  return true;
}

// Get all vehicle numbers
export function getAllVehicles(): string[] {
  const data = getFuelData();
  return Object.keys(data.vehicles);
}

// Extract last digit from vehicle number
export function extractLastDigit(vehicleNumber: string): number | null {
  const digits = vehicleNumber.match(/\d/g);
  if (!digits || digits.length === 0) {
    return null;
  }
  return parseInt(digits[digits.length - 1], 10);
}

// Check if digit is even
export function isEven(digit: number): boolean {
  return digit % 2 === 0;
}

// Check if date is even
export function isDateEven(date: Date): boolean {
  return date.getDate() % 2 === 0;
}

// Check if vehicle is eligible on a given date
export function isEligible(vehicleNumber: string, date: Date): boolean {
  const lastDigit = extractLastDigit(vehicleNumber);
  if (lastDigit === null) {
    return false;
  }
  
  const digitEven = isEven(lastDigit);
  const dateEven = isDateEven(date);
  
  return digitEven === dateEven;
}

// Get next eligible date for vehicle
export function getNextEligibleDate(vehicleNumber: string): Date | null {
  const lastDigit = extractLastDigit(vehicleNumber);
  if (lastDigit === null) {
    return null;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const digitEven = isEven(lastDigit);
  
  // Start checking from tomorrow
  let checkDate = new Date(today);
  checkDate.setDate(checkDate.getDate() + 1);
  
  // Find next eligible date (within next 7 days)
  for (let i = 0; i < 7; i++) {
    const dateEven = isDateEven(checkDate);
    if (digitEven === dateEven) {
      return checkDate;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }
  
  return null;
}

// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Check if two dates are the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Get start of week (Monday)
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Check if a week has passed since last reset
export function hasWeekPassed(lastResetDate: string | undefined): boolean {
  if (!lastResetDate) return true;
  
  const today = new Date();
  const lastReset = new Date(lastResetDate);
  const daysPassed = Math.floor((today.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysPassed >= 7;
}

// Reset vehicle usage for the week
export function resetWeeklyUsage(vehicleNumber: string): void {
  const data = getFuelData();
  const vehicle = data.vehicles[vehicleNumber];
  
  if (vehicle) {
    vehicle.used = 0;
    vehicle.logs = {};
    vehicle.lastResetDate = formatDate(new Date());
    saveFuelData(data);
  }
}

// Check and apply weekly reset if needed
export function checkAndApplyWeeklyReset(vehicleNumber: string): void {
  const data = getFuelData();
  const vehicle = data.vehicles[vehicleNumber];
  
  if (vehicle && hasWeekPassed(vehicle.lastResetDate)) {
    resetWeeklyUsage(vehicleNumber);
  }
}

// Get fuel history entries for a vehicle
export interface FuelHistoryEntry {
  date: string;
  liters: number;
  dateObj: Date;
}

export function getFuelHistory(vehicleNumber: string): FuelHistoryEntry[] {
  const data = getFuelData();
  const vehicle = data.vehicles[vehicleNumber];
  
  if (!vehicle) return [];
  
  return Object.entries(vehicle.logs)
    .map(([date, liters]) => ({
      date,
      liters,
      dateObj: new Date(date),
    }))
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
}

// Get fuel logged on a specific date
export function getFuelOnDate(vehicleNumber: string, date: string): number | null {
  const data = getFuelData();
  const vehicle = data.vehicles[vehicleNumber];
  
  if (!vehicle) return null;
  
  return vehicle.logs[date] || null;
}

// Get total fuel logged in a month
export function getFuelForMonth(vehicleNumber: string, year: number, month: number): number {
  const data = getFuelData();
  const vehicle = data.vehicles[vehicleNumber];
  
  if (!vehicle) return 0;
  
  return Object.entries(vehicle.logs)
    .filter(([date]) => {
      const d = new Date(date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((sum, [, liters]) => sum + liters, 0);
}
