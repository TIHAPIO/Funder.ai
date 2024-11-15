import { Campaign } from '../types/campaign'

export function formatDate(date: string): string {
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date')
    }
    return dateObj.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Ungültiges Datum'
  }
}

export function formatDateWithMonth(date: string): string {
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date')
    }
    return dateObj.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short'
    })
  } catch (error) {
    console.error('Error formatting date with month:', error)
    return 'Ungültiges Datum'
  }
}

interface ResourceStatus {
  color: string
  text: string
  percentage: number
  status: 'success' | 'warning' | 'error'
}

export function getResourceStatus(confirmed: number, required: number): ResourceStatus {
  const percentage = required > 0 ? (confirmed / required) * 100 : 0
  
  let status: 'success' | 'warning' | 'error'
  let color: string

  if (percentage === 100) {
    status = 'success'
    color = 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
  } else if (percentage >= 80) {
    status = 'warning'
    color = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
  } else {
    status = 'error'
    color = 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
  }

  return {
    color,
    text: `${confirmed}/${required}`,
    percentage,
    status
  }
}

interface TeamStatus {
  text: string
  color: string
  percentage: number
  status: 'success' | 'warning' | 'error'
}

export function getTeamStatus(team: Campaign['team']): TeamStatus {
  const confirmed = team.current.filter(m => m.confirmed).length
  const percentage = team.maxSize > 0 ? (confirmed / team.maxSize) * 100 : 0
  
  let status: 'success' | 'warning' | 'error'
  let color: string

  if (percentage >= 80) {
    status = 'success'
    color = 'bg-green-500 dark:bg-green-400'
  } else if (percentage >= 50) {
    status = 'warning'
    color = 'bg-yellow-500 dark:bg-yellow-400'
  } else {
    status = 'error'
    color = 'bg-red-500 dark:bg-red-400'
  }

  return {
    text: `${confirmed}/${team.maxSize}`,
    color,
    percentage,
    status
  }
}

export function getWeekNumber(date: Date): number {
  try {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    // Get first day of year
    const yearStart = new Date(d.getFullYear(), 0, 1)
    // Calculate full weeks to nearest Thursday
    const weekNumber = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
    return weekNumber
  } catch (error) {
    console.error('Error calculating week number:', error)
    return 0
  }
}

export function getDaysInYear(year: number): number {
  return ((year % 4 === 0 && year % 100 > 0) || year % 400 === 0) ? 366 : 365
}

export function getTimelineMarkers(currentDate: Date, zoomLevel: 'year' | 'month') {
  try {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    if (zoomLevel === 'year') {
      const markers = []
      for (let m = 0; m < 12; m++) {
        const monthStart = new Date(year, m, 1)
        const monthEnd = new Date(year, m + 1, 0)
        const firstMonday = new Date(year, m, 1 + ((8 - monthStart.getDay()) % 7))
        
        markers.push({
          label: monthStart.toLocaleDateString('de-DE', { month: 'short' }),
          isMonth: true,
          isWeekStart: true,
          weekNumber: getWeekNumber(firstMonday),
          date: monthStart
        })

        // Add week markers for the rest of the month
        let currentDate = new Date(firstMonday)
        currentDate.setDate(currentDate.getDate() + 7)
        
        while (currentDate <= monthEnd) {
          markers.push({
            label: '',
            isMonth: false,
            isWeekStart: true,
            weekNumber: getWeekNumber(currentDate),
            date: new Date(currentDate)
          })
          currentDate.setDate(currentDate.getDate() + 7)
        }
      }
      return markers
    } else {
      const markers = []
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const isWeekStart = date.getDay() === 1 // Monday
        
        markers.push({
          label: day.toString(),
          isMonth: false,
          isWeekStart,
          weekNumber: isWeekStart ? getWeekNumber(date) : undefined,
          date
        })
      }
      
      return markers
    }
  } catch (error) {
    console.error('Error generating timeline markers:', error)
    return []
  }
}
