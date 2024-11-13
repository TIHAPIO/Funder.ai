import { Campaign } from '@/types/campaign'

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
  
  if (zoomLevel === 'year') {
    return Array.from({ length: 12 }, (_, month) => ({
      label: new Date(year, month, 1).toLocaleDateString('de-DE', { month: 'short' }),
      isMonth: true,
      date: new Date(year, month, 1)
    }))
  } else {
    const allMarkers = []
    
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const isWeekStart = date.getDay() === 1
        
        allMarkers.push({
          label: day.toString(),
          isMonth: false,
          isWeekStart,
          weekNumber: isWeekStart ? getWeekNumber(date) : undefined,
          date
        })
      }
    }
    
    return allMarkers
  }
}
