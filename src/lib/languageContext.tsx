'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define available languages
export type Language = 'en' | 'vi'

// Language context type
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key
})

// Dictionary of translations
export const translations: Record<string, Record<string, string>> = {
  // Navigation
  'nav.dashboard': {
    en: 'Dashboard',
    vi: 'Bảng điều khiển'
  },
  'nav.trades': {
    en: 'Trades',
    vi: 'Nhật ký lệnh'
  },
  // Dashboard page
  'dashboard.title': {
    en: 'Trading Dashboard',
    vi: 'Bảng điều khiển giao dịch'
  },
  'dashboard.account': {
    en: 'Account',
    vi: 'Tài khoản'
  },
  'dashboard.currentValue': {
    en: 'Current Value',
    vi: 'Giá trị hiện tại'
  },
  'dashboard.winRate': {
    en: 'Win Rate',
    vi: 'Tỷ lệ thắng'
  },
  'dashboard.overall': {
    en: 'Overall',
    vi: 'Tổng quan'
  },
  'dashboard.trades': {
    en: 'trades',
    vi: 'lệnh'
  },
  'dashboard.performance': {
    en: 'Performance',
    vi: 'Hiệu suất'
  },
  'dashboard.thisMonth': {
    en: 'This Month',
    vi: 'Tháng này'
  },
  'dashboard.thisYear': {
    en: 'This Year',
    vi: 'Năm nay'
  },
  'dashboard.riskReward': {
    en: 'Risk-Reward',
    vi: 'Rủi ro-Lợi nhuận'
  },
  'dashboard.averageRR': {
    en: 'Average RR',
    vi: 'RR trung bình'
  },
  'dashboard.totalPL': {
    en: 'Total P/L',
    vi: 'Tổng lãi/lỗ'
  },
  'dashboard.performanceChart': {
    en: 'Performance Chart',
    vi: 'Biểu đồ hiệu suất'
  },
  'dashboard.monthly': {
    en: 'Monthly',
    vi: 'Theo tháng'
  },
  'dashboard.yearly': {
    en: 'Yearly',
    vi: 'Theo năm'
  },
  'dashboard.updateAccount': {
    en: 'Update Initial Account Value',
    vi: 'Cập nhật giá trị tài khoản ban đầu'
  },
  'dashboard.invalidAmount': {
    en: 'Invalid amount',
    vi: 'Số tiền không hợp lệ'
  },
  'dashboard.enterValidNumber': {
    en: 'Please enter a valid positive number',
    vi: 'Vui lòng nhập một số dương hợp lệ'
  },
  'dashboard.accountUpdated': {
    en: 'Account value updated',
    vi: 'Giá trị tài khoản đã được cập nhật'
  },
  'dashboard.initialAccountSet': {
    en: 'Initial account value set to',
    vi: 'Giá trị tài khoản ban đầu được đặt thành'
  },
  'dashboard.depositNote': {
    en: 'This will adjust your initial deposit amount. Your percentage gains/losses will remain the same.',
    vi: 'Điều này sẽ điều chỉnh số tiền ký gửi ban đầu của bạn. Phần trăm lãi/lỗ của bạn sẽ giữ nguyên.'
  },
  'dashboard.update': {
    en: 'Update',
    vi: 'Cập nhật'
  },
  'dashboard.cancel': {
    en: 'Cancel',
    vi: 'Hủy'
  },
  'dashboard.edit': {
    en: 'Edit',
    vi: 'Sửa'
  },
  // Trades page
  'trades.title': {
    en: 'Trade Journal',
    vi: 'Nhật ký giao dịch'
  },
  'trades.addNew': {
    en: 'Add New Trade',
    vi: 'Thêm giao dịch mới'
  },
  'trades.search': {
    en: 'Search by pair, setup, or notes...',
    vi: 'Tìm kiếm theo cặp tiền, chiến lược, hoặc ghi chú...'
  },
  'trades.date': {
    en: 'Date',
    vi: 'Ngày'
  },
  'trades.pair': {
    en: 'Pair',
    vi: 'Cặp tiền'
  },
  'trades.status': {
    en: 'Status',
    vi: 'Trạng thái'
  },
  'trades.margin': {
    en: 'Margin',
    vi: 'Ký quỹ'
  },
  'trades.setup': {
    en: 'Setup',
    vi: 'Chiến lược'
  },
  'trades.rr': {
    en: 'R:R',
    vi: 'R:R'
  },
  'trades.pl': {
    en: 'P/L (%)',
    vi: 'Lãi/Lỗ (%)'
  },
  'trades.plAmount': {
    en: 'P/L (VND)',
    vi: 'Lãi/Lỗ (VND)'
  },
  'trades.actions': {
    en: 'Actions',
    vi: 'Hành động'
  },
  'trades.noTradesFound': {
    en: 'No trades found. Add a new trade to get started!',
    vi: 'Không tìm thấy giao dịch nào. Thêm giao dịch mới để bắt đầu!'
  },
  'trades.view': {
    en: 'View',
    vi: 'Xem'
  },
  'trades.delete': {
    en: 'Delete',
    vi: 'Xóa'
  },
  'trades.edit': {
    en: 'Edit',
    vi: 'Sửa'
  },
  'trades.editTrade': {
    en: 'Edit Trade',
    vi: 'Sửa Giao Dịch'
  },
  'trades.saveChanges': {
    en: 'Save Changes',
    vi: 'Lưu Thay Đổi'
  },
  'trades.tradeUpdated': {
    en: 'Trade updated successfully',
    vi: 'Giao dịch đã được cập nhật thành công'
  },
  'trades.tradeDetails': {
    en: 'Trade Details',
    vi: 'Chi tiết giao dịch'
  },
  'trades.close': {
    en: 'Close',
    vi: 'Đóng'
  },
  'trades.tradeDeleted': {
    en: 'Trade deleted',
    vi: 'Giao dịch đã bị xóa'
  },
  // Trade details
  'tradeDetails.date': {
    en: 'Date:',
    vi: 'Ngày:'
  },
  'tradeDetails.marginDeposit': {
    en: 'Margin/Deposit:',
    vi: 'Ký quỹ/Tiền đặt cọc:'
  },
  'tradeDetails.setup': {
    en: 'Setup:',
    vi: 'Chiến lược:'
  },
  'tradeDetails.htfTrend': {
    en: 'Higher Timeframe Trend:',
    vi: 'Xu hướng khung thời gian cao hơn:'
  },
  'tradeDetails.expectedRR': {
    en: 'Expected Risk-Reward:',
    vi: 'Tỷ lệ rủi ro-lợi nhuận dự kiến:'
  },
  'tradeDetails.tp1': {
    en: 'Take Profit 1:',
    vi: 'Chốt lời 1:'
  },
  'tradeDetails.tp2': {
    en: 'Take Profit 2:',
    vi: 'Chốt lời 2:'
  },
  'tradeDetails.sl': {
    en: 'Stop Loss:',
    vi: 'Dừng lỗ:'
  },
  'tradeDetails.profitLoss': {
    en: 'Profit/Loss:',
    vi: 'Lãi/Lỗ:'
  },
  'tradeDetails.psychology': {
    en: 'Psychology:',
    vi: 'Tâm lý:'
  },
  'tradeDetails.notes': {
    en: 'Notes:',
    vi: 'Ghi chú:'
  },
  'tradeDetails.chartImage': {
    en: 'Chart Image:',
    vi: 'Hình ảnh biểu đồ:'
  },
  'tradeDetails.position': {
    en: 'of position',
    vi: 'của vị thế'
  },
  'tradeDetails.hit': {
    en: 'Hit',
    vi: 'Đã đạt'
  },
  'tradeDetails.notHit': {
    en: 'Not Hit',
    vi: 'Không đạt'
  },
  'tradeDetails.accountRisk': {
    en: 'of account',
    vi: 'của tài khoản'
  },
  // Add trade form
  'addTrade.title': {
    en: 'Add New Trade',
    vi: 'Thêm giao dịch mới'
  },
  'addTrade.date': {
    en: 'Date',
    vi: 'Ngày'
  },
  'addTrade.pair': {
    en: 'Currency Pair',
    vi: 'Cặp tiền tệ'
  },
  'addTrade.pairPlaceholder': {
    en: 'e.g. EUR/USD',
    vi: 'vd: EUR/USD'
  },
  'addTrade.htfTrend': {
    en: 'Higher Timeframe Trend',
    vi: 'Xu hướng khung thời gian cao hơn'
  },
  'addTrade.selectTrend': {
    en: 'Select Trend',
    vi: 'Chọn xu hướng'
  },
  'addTrade.bullish': {
    en: 'Bullish',
    vi: 'Tăng'
  },
  'addTrade.bearish': {
    en: 'Bearish',
    vi: 'Giảm'
  },
  'addTrade.ranging': {
    en: 'Ranging',
    vi: 'Đi ngang'
  },
  'addTrade.unclear': {
    en: 'Unclear',
    vi: 'Không rõ ràng'
  },
  'addTrade.ictSetup': {
    en: 'ICT Setup',
    vi: 'Chiến lược ICT'
  },
  'addTrade.ictSetupPlaceholder': {
    en: 'e.g. BPR, OTE, etc.',
    vi: 'vd: BPR, OTE, v.v.'
  },
  'addTrade.marginAmount': {
    en: 'Margin/Deposit Amount (VNĐ)',
    vi: 'Số tiền ký quỹ/đặt cọc (VNĐ)'
  },
  'addTrade.marginHelp': {
    en: 'Amount used as margin for this trade',
    vi: 'Số tiền ký quỹ cho giao dịch này'
  },
  'addTrade.expectedRR': {
    en: 'Expected Risk-Reward Ratio',
    vi: 'Tỷ lệ rủi ro-lợi nhuận dự kiến'
  },
  'addTrade.tp1': {
    en: 'Take Profit 1',
    vi: 'Chốt lời 1'
  },
  'addTrade.tp1RR': {
    en: 'TP1 Risk-Reward',
    vi: 'Tỷ lệ R:R của TP1'
  },
  'addTrade.tp1Percentage': {
    en: 'TP1 Position Percentage',
    vi: 'Phần trăm vị thế tại TP1'
  },
  'addTrade.tp1PercentageHelp': {
    en: '% of position closed at TP1',
    vi: '% vị thế đóng tại TP1'
  },
  'addTrade.tp1Hit': {
    en: 'TP1 was hit',
    vi: 'TP1 đã được đạt'
  },
  'addTrade.tp2': {
    en: 'Take Profit 2',
    vi: 'Chốt lời 2'
  },
  'addTrade.tp2RR': {
    en: 'TP2 Risk-Reward',
    vi: 'Tỷ lệ R:R của TP2'
  },
  'addTrade.tp2Percentage': {
    en: 'TP2 Position Percentage',
    vi: 'Phần trăm vị thế tại TP2'
  },
  'addTrade.tp2PercentageHelp': {
    en: '% of position closed at TP2',
    vi: '% vị thế đóng tại TP2'
  },
  'addTrade.tp2Hit': {
    en: 'TP2 was hit',
    vi: 'TP2 đã được đạt'
  },
  'addTrade.sl': {
    en: 'Stop Loss',
    vi: 'Dừng lỗ'
  },
  'addTrade.slPercentage': {
    en: 'SL Risk Percentage',
    vi: 'Phần trăm rủi ro của SL'
  },
  'addTrade.slPercentageHelp': {
    en: '% of account risked',
    vi: '% tài khoản bị rủi ro'
  },
  'addTrade.slHit': {
    en: 'SL was hit',
    vi: 'SL đã được đạt'
  },
  'addTrade.plPercentage': {
    en: 'Profit/Loss (%)',
    vi: 'Lãi/Lỗ (%)'
  },
  'addTrade.plPercentageHelp': {
    en: 'Percentage gain/loss relative to total account balance',
    vi: 'Phần trăm lãi/lỗ so với tổng số dư tài khoản'
  },
  'addTrade.plAmount': {
    en: 'Profit/Loss (VND)',
    vi: 'Lãi/Lỗ (VND)'
  },
  'addTrade.plAmountHelp': {
    en: 'Actual amount gained or lost in VND',
    vi: 'Số tiền thực tế lãi hoặc lỗ bằng VND'
  },
  'addTrade.calculate': {
    en: 'Calculate from TP/SL',
    vi: 'Tính toán từ TP/SL'
  },
  'addTrade.tradeStatus': {
    en: 'Trade Status',
    vi: 'Trạng thái giao dịch'
  },
  'addTrade.win': {
    en: 'Win',
    vi: 'Thắng'
  },
  'addTrade.loss': {
    en: 'Loss',
    vi: 'Thua'
  },
  'addTrade.be': {
    en: 'Breakeven',
    vi: 'Hòa vốn'
  },
  'addTrade.psychology': {
    en: 'Psychology',
    vi: 'Tâm lý'
  },
  'addTrade.fomo': {
    en: 'FOMO',
    vi: 'FOMO'
  },
  'addTrade.confident': {
    en: 'Confident',
    vi: 'Tự tin'
  },
  'addTrade.worried': {
    en: 'Worried',
    vi: 'Lo lắng'
  },
  'addTrade.neutral': {
    en: 'Neutral',
    vi: 'Trung tính'
  },
  'addTrade.impatient': {
    en: 'Impatient',
    vi: 'Thiếu kiên nhẫn'
  },
  'addTrade.disciplined': {
    en: 'Disciplined',
    vi: 'Kỷ luật'
  },
  'addTrade.notes': {
    en: 'Notes',
    vi: 'Ghi chú'
  },
  'addTrade.notesPlaceholder': {
    en: 'Add any additional notes about the trade...',
    vi: 'Thêm bất kỳ ghi chú bổ sung nào về giao dịch...'
  },
  'addTrade.chartImage': {
    en: 'Chart Image',
    vi: 'Hình ảnh biểu đồ'
  },
  'addTrade.preview': {
    en: 'Preview:',
    vi: 'Xem trước:'
  },
  'addTrade.saveTrade': {
    en: 'Save Trade',
    vi: 'Lưu giao dịch'
  },
  'addTrade.cancel': {
    en: 'Cancel',
    vi: 'Hủy'
  },
  'addTrade.missingInfo': {
    en: 'Missing information',
    vi: 'Thiếu thông tin'
  },
  'addTrade.enterPair': {
    en: 'Please enter the currency pair',
    vi: 'Vui lòng nhập cặp tiền tệ'
  },
  'addTrade.tradeAdded': {
    en: 'Trade added successfully',
    vi: 'Giao dịch đã được thêm thành công'
  },
  // Language switcher
  'language.en': {
    en: 'English',
    vi: 'Tiếng Anh'
  },
  'language.vi': {
    en: 'Vietnamese',
    vi: 'Tiếng Việt'
  },
  'trades.sort': {
    en: 'Sort by',
    vi: 'Sắp xếp theo'
  },
  'trades.sortDate': {
    en: 'Date',
    vi: 'Ngày'
  },
  'trades.sortProfitAmount': {
    en: 'Profit Amount (VND)',
    vi: 'Lãi (VND)'
  },
  'trades.sortProfitPercentage': {
    en: 'Profit Percentage (%)',
    vi: 'Lãi (%)'
  },
  'trades.sortOrder': {
    en: 'Order',
    vi: 'Thứ tự'
  },
  'trades.sortAscending': {
    en: 'Ascending',
    vi: 'Tăng dần'
  },
  'trades.sortDescending': {
    en: 'Descending',
    vi: 'Giảm dần'
  }
}

// Language provider component
interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en')

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translations[key][language] || key
  }

  const value = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 