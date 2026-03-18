# Fuel Pass - Eligibility & Tracking System

A modern, clean, and responsive web application for tracking fuel eligibility and usage based on vehicle number parity (even/odd rule).

## Features

### Core Functionality
- **Vehicle Input**: Add vehicles by entering their number (digits only or full number)
- **Fuel Rule Logic**: 
  - Even last digit → allowed on even dates
  - Odd last digit → allowed on odd dates
- **Interactive Calendar**: 
  - Full month view with color-coded eligibility
  - Green days = allowed, Red days = not allowed
  - Click allowed dates to log fuel
- **Fuel Tracking**: 
  - 15L default quota per vehicle
  - Track used and remaining fuel
  - View progress with visual progress bar
- **Multiple Vehicles**: Store and switch between multiple vehicles
- **Next Eligible Date**: Shows when you can next get fuel

### UI Features
- Clean, minimal design
- Fully responsive (mobile + desktop)
- Dark/light mode toggle
- Real-time updates
- localStorage persistence

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui components**
- **next-themes** (dark mode)
- **Radix UI** (accessible components)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PruthuviDe/FuelPass.git
cd FuelPass
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Add a Vehicle**: Enter your vehicle number (e.g., "ABC-1234" or "3040")
2. **View Calendar**: See which dates you're eligible to get fuel
3. **Log Fuel**: Click on an allowed date and enter the amount of fuel received
4. **Track Usage**: Monitor your fuel quota and remaining allocation
5. **Multiple Vehicles**: Add more vehicles and switch between them using the dropdown

## Data Structure

Data is stored in localStorage with the following structure:

```json
{
  "vehicles": {
    "ABC-1234": {
      "quota": 15,
      "used": 8.5,
      "logs": {
        "2026-03-18": 5,
        "2026-03-20": 3.5
      }
    }
  }
}
```

## Components

- **VehicleInput**: Form to add new vehicles
- **VehicleSelector**: Dropdown to switch between vehicles
- **Dashboard**: Stats display (quota, used, remaining, next eligible date)
- **Calendar**: Interactive calendar with eligibility visualization
- **FuelDialog**: Modal for entering fuel amounts
- **ThemeToggle**: Dark/light mode switcher

## Utility Functions

Located in `lib/fuel-utils.ts`:
- `extractLastDigit()`: Extract last digit from vehicle number
- `isEven()`: Check if number is even
- `isEligible()`: Check eligibility for date
- `getNextEligibleDate()`: Calculate next allowed date
- `addFuelLog()`: Store fuel entry
- `getVehicleData()`: Retrieve vehicle info
- `getFuelData()` / `saveFuelData()`: localStorage operations

## Build for Production

```bash
npm run build
npm start
```

## License

ISC

## Author

Built with Next.js, React, Tailwind CSS, and shadcn/ui
