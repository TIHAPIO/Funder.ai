'use client';

import { createContext, useContext } from 'react'
import { themeConfig } from '@/styles/theme'

type ThemeContextType = {
  getCardClass: (options?: { hover?: boolean }) => string
  getStatusClass: (status: 'success' | 'warning' | 'error' | 'info') => string
  getBadgeClass: (variant: 'success' | 'warning' | 'error' | 'info') => string
  getContainerClass: (type: 'base' | 'header' | 'grid') => string
  getTextClass: (type: 'base' | 'muted' | 'title') => string
}

const ThemeContext = createContext<ThemeContextType>({
  getCardClass: () => '',
  getStatusClass: () => '',
  getBadgeClass: () => '',
  getContainerClass: () => '',
  getTextClass: () => '',
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const getCardClass = (options?: { hover?: boolean }) => {
    return `${themeConfig.card.base} ${options?.hover ? themeConfig.card.hover : ''}`.trim()
  }

  const getStatusClass = (status: 'success' | 'warning' | 'error' | 'info') => {
    return themeConfig.status[status]
  }

  const getBadgeClass = (variant: 'success' | 'warning' | 'error' | 'info') => {
    return `${themeConfig.badge.base} ${themeConfig.status[variant]}`.trim()
  }

  const getContainerClass = (type: 'base' | 'header' | 'grid') => {
    return themeConfig.container[type]
  }

  const getTextClass = (type: 'base' | 'muted' | 'title') => {
    return themeConfig.text[type]
  }

  return (
    <ThemeContext.Provider value={{
      getCardClass,
      getStatusClass,
      getBadgeClass,
      getContainerClass,
      getTextClass,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
