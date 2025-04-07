TradingJ is a modern, feature-rich trading journal application designed to help traders track their trades, analyze performance, and improve their trading strategies.

## Features

### Dashboard Overview
- Track initial account value and current account performance
- Monitor profit/loss metrics by day, month, and year
- Visualize win rate and average risk-reward ratio
- View performance charts for easy trend identification

### Detailed Trade Tracking
- Log trades with comprehensive details:
  - Date and currency pair
  - Higher timeframe trend and ICT setup
  - Risk-reward expectations
  - Take profit levels (TP1, TP2) with position sizing
  - Stop loss with risk percentage
  - Profit/loss results
  - Trade status (Win/Loss/BE)
  - Psychology status during trading
  - Notes and chart image uploads

### Additional Utilities
- Automatic calculation of total profit/loss by day/month/year
- Automatic calculation of average risk-reward ratio
- Image upload for each trade's chart
- Clean, user-friendly interface with dark/light mode support

## Getting Started

### Prerequisites
- Node.js 18.17.0 or later
- npm or yarn

### Installation

- Either download from release or run from source codes

1. Clone the repository
```bash
git clone https://github.com/yourusername/tradingj.git
cd tradingj
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Usage

### Adding a Trade
1. Navigate to the Trades page
2. Click "Add New Trade"
3. Fill in the trade details including:
   - Date and currency pair
   - Higher timeframe trend and setup
   - Expected risk-reward ratio
   - Take profit and stop loss levels
   - Win/loss outcome
   - Psychology during the trade
   - Notes and chart image

### Viewing Performance
- The Dashboard page provides a quick overview of your trading performance
- View performance metrics like win rate and average risk-reward ratio
- Track your account growth over time with the performance chart

## Technology Stack

- Next.js 14 - React framework
- TypeScript - Type safety
- Chakra UI - UI components
- Zustand - State management
- Chart.js - Data visualization

## Acknowledgments

- Designed for traders using ICT trading methodology
