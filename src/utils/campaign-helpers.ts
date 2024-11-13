import { Campaign } from '../types/campaign'

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit'
  })
}

export function formatDateWithMonth(date: string): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short'
  })
}

export function getResourceStatus(confirmed: number, required: number) {
  const percentage = (confirmed / required) * 100
  return {
    color: percentage === 100 
      ? 'bg-green-100 text-green-700' 
      : percentage >= 80 
        ? 'bg-yellow-100 text-yellow-700' 
        : 'bg-red-100 text-red-700',
    text: `${confirmed}/${required}`,
    percentage
  }
}

export function getTeamStatus(team: Campaign['team']) {
  const confirmed = team.current.filter(m => m.confirmed).length
  const percentage = (confirmed / team.maxSize) * 100
  return {
    text: `${confirmed}/${team.maxSize}`,
    color: percentage >= 80 ? 'bg-green-500' : 'bg-red-500',
    percentage
  }
}

export function getWeekNumber(date: Date): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function getTimelineMarkers(currentDate: Date, zoomLevel: 'year' | 'month') {
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
      const isWeekStart = date.getDay() === 1
      
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
}
