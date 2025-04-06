import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TradeStatus = 'Win' | 'Loss' | 'BE'
export type Psychology = 'FOMO' | 'Confident' | 'Worried' | 'Neutral' | 'Impatient' | 'Disciplined' | string

export interface Trade {
  id: string
  date: string
  pair: string
  htfTrend: string
  ictSetup: string
  margin: number // Amount used as margin/deposit for this trade
  expectedRR: number
  tp1: {
    rr: number
    percentage: number
    hit: boolean
  }
  tp2: {
    rr: number
    percentage: number
    hit: boolean
  }
  sl: {
    percentage: number
    hit: boolean
  }
  profitLossPercentage: number
  profitLossAmount: number // Actual profit/loss amount in VND
  status: TradeStatus
  psychology: Psychology
  notes: string
  image: string | null
}

interface TradingJournalState {
  initialAccount: number
  trades: Trade[]
  setInitialAccount: (amount: number) => void
  addTrade: (trade: Omit<Trade, 'id'>) => void
  updateTrade: (id: string, trade: Partial<Trade>) => void
  deleteTrade: (id: string) => void
  calculateDailyPL: (date: string) => number
  calculateMonthlyPL: (year: number, month: number) => number
  calculateYearlyPL: (year: number) => number
  calculateWinRate: () => number
  calculateAverageRR: () => number
}

export const useStore = create<TradingJournalState>()(
  persist(
    (set, get) => ({
      initialAccount: 100000000, // 100 million VND default
      trades: [],
      setInitialAccount: (amount) => set({ initialAccount: amount }),
      addTrade: (trade) => set((state) => ({ 
        trades: [...state.trades, { ...trade, id: Date.now().toString() }] 
      })),
      updateTrade: (id, updatedTrade) => set((state) => ({
        trades: state.trades.map((trade) => 
          trade.id === id ? { ...trade, ...updatedTrade } : trade
        )
      })),
      deleteTrade: (id) => set((state) => ({
        trades: state.trades.filter((trade) => trade.id !== id)
      })),
      calculateDailyPL: (date) => {
        const tradesForDay = get().trades.filter(trade => 
          trade.date === date
        )
        return tradesForDay.reduce((total, trade) => total + trade.profitLossAmount, 0)
      },
      calculateMonthlyPL: (year, month) => {
        const tradesForMonth = get().trades.filter(trade => {
          const tradeDate = new Date(trade.date)
          return tradeDate.getFullYear() === year && tradeDate.getMonth() === month
        })
        return tradesForMonth.reduce((total, trade) => total + trade.profitLossAmount, 0)
      },
      calculateYearlyPL: (year) => {
        const tradesForYear = get().trades.filter(trade => {
          const tradeDate = new Date(trade.date)
          return tradeDate.getFullYear() === year
        })
        return tradesForYear.reduce((total, trade) => total + trade.profitLossAmount, 0)
      },
      calculateWinRate: () => {
        const trades = get().trades
        if (trades.length === 0) return 0
        
        const wins = trades.filter(trade => trade.status === 'Win').length
        return (wins / trades.length) * 100
      },
      calculateAverageRR: () => {
        const trades = get().trades
        if (trades.length === 0) return 0
        
        const totalRR = trades.reduce((total, trade) => {
          // For winning trades, use the actual RR achieved
          if (trade.status === 'Win') {
            let achievedRR = 0
            if (trade.tp1.hit) achievedRR += trade.tp1.rr * (trade.tp1.percentage / 100)
            if (trade.tp2.hit) achievedRR += trade.tp2.rr * (trade.tp2.percentage / 100)
            return total + achievedRR
          }
          // For losing trades, use -1 as the risk was fully realized
          else if (trade.status === 'Loss') {
            return total - 1
          }
          // For breakeven trades, use 0
          return total
        }, 0)
        
        return totalRR / trades.length
      }
    }),
    {
      name: 'trading-journal-storage',
    }
  )
) 