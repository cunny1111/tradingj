'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { useStore } from '@/lib/store'
import { formatCurrency, groupTradesByPeriod, getMonthName } from '@/lib/utils'

interface PerformanceChartProps {
  period: 'month' | 'year'
}

export default function PerformanceChart({ period }: PerformanceChartProps) {
  const { trades, initialAccount } = useStore()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || trades.length === 0) return

    // Sort trades by date
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Group trades by period
    const tradesByPeriod = groupTradesByPeriod(sortedTrades, period)
    
    // Calculate cumulative P/L
    const labels: string[] = []
    const accountValues: number[] = []
    
    let currentValue = initialAccount
    
    // Process all periods with trades
    Object.entries(tradesByPeriod).forEach(([periodKey, periodTrades]) => {
      // Format the label based on period type
      if (period === 'month') {
        // Convert YYYY-MM to Month YYYY (e.g., January 2025)
        const [year, month] = periodKey.split('-')
        labels.push(`${getMonthName(parseInt(month, 10) - 1)} ${year}`)
      } else {
        // Year period
        labels.push(periodKey)
      }
      
      // Calculate period P/L using actual amounts
      const periodPLAmount = periodTrades.reduce(
        (sum, trade) => sum + trade.profitLossAmount, 
        0
      )
      
      // Calculate account value by adding the actual profit/loss amount
      currentValue = currentValue + periodPLAmount
      accountValues.push(currentValue)
    })

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Account Value',
            data: accountValues,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.1,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                return `Account Value: ${formatCurrency(value)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Account Value (VNĐ)',
            },
            ticks: {
              callback: function(value) {
                return formatCurrency(value as number);
              }
            }
          },
          x: {
            title: {
              display: true,
              text: period === 'month' ? 'Month' : 'Year',
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [trades, initialAccount, period])

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      {trades.length === 0 ? (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          No trading data available yet.
          <br />
          Start adding trades to see your performance chart.
        </div>
      ) : null}
      <canvas ref={chartRef} />
    </div>
  )
} 