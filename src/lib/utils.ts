import { Trade } from '@/lib/store' // Import kiểu Trade từ store

/**
 * Format a number as a percentage with 2 decimal places
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

/**
 * Format a number as currency (VND)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

/**
 * Calculate account value based on initial amount and percentage changes
 */
export function calculateAccountValue(initialAmount: number, percentageChanges: number[]): number {
  return percentageChanges.reduce((amount, change) => {
    return amount * (1 + change / 100)
  }, initialAmount)
}

/**
 * Group trades by day, month, or year
 */
export function groupTradesByPeriod(trades: Trade[], period: 'day' | 'month' | 'year'): Record<string, Trade[]> {
  return trades.reduce((groups, trade) => {
    const date = new Date(trade.date)
    let key: string
    
    if (period === 'day') {
      key = trade.date
    } else if (period === 'month') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    } else {
      key = `${date.getFullYear()}`
    }
    
    if (!groups[key]) {
      groups[key] = []
    }
    
    groups[key].push(trade)
    return groups
  }, {} as Record<string, Trade[]>)
}

/**
 * Helper to convert base64 to file
 */
export async function base64ToFile(base64String: string, filename: string): Promise<File> {
  const res = await fetch(base64String)
  const blob = await res.blob()
  return new File([blob], filename, { type: blob.type })
}

/**
 * Convert File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

/**
 * Get month name from month number (0-11)
 */
export function getMonthName(month: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return monthNames[month]
}

// Format date
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};