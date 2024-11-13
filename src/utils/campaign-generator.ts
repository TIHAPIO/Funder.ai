import { Campaign, TeamMember } from '@/types/campaign'

const cities = [
  { name: 'München', state: 'Bayern' },
  { name: 'Stuttgart', state: 'Baden-Württemberg' },
  { name: 'Frankfurt', state: 'Hessen' },
  { name: 'Hamburg', state: 'Hamburg' },
  { name: 'Berlin', state: 'Berlin' },
  { name: 'Köln', state: 'Nordrhein-Westfalen' },
  { name: 'Dresden', state: 'Sachsen' },
  { name: 'Hannover', state: 'Niedersachsen' }
]

const teamLeaderNames = [
  'Marcus Schmidt', 'Lisa Wagner', 'Thomas Müller', 'Sarah Weber',
  'Jan Becker', 'Anna Klein', 'Michael Koch', 'Julia Hoffmann',
  'Felix Bauer', 'Laura Meyer', 'David Fischer', 'Emma Schneider'
]

const werberNames = [
  'Max Mustermann', 'Maria Musterfrau', 'Peter Pan', 'Sophie Scholl',
  'Klaus Kleber', 'Nina Neumann', 'Tim Taler', 'Lena Ludwig',
  'Paul Peters', 'Karin Kraft', 'Oliver Otto', 'Hannah Huber',
  'Robert Reich', 'Petra Pause', 'Frank Frei', 'Sabine Sauer'
]

function generateTeamMembers(
  startDate: Date,
  endDate: Date,
  campaignId: number
): TeamMember[] {
  const teamMembers: TeamMember[] = []
  let currentTeamLeaderStart = new Date(startDate)
  
  // Add team leaders with rotations
  while (currentTeamLeaderStart < endDate) {
    const leaderDuration = Math.min(
      Math.floor(Math.random() * (28 - 7 + 1) + 7), // 1-4 weeks
      (endDate.getTime() - currentTeamLeaderStart.getTime()) / (1000 * 60 * 60 * 24)
    )
    const leaderEndDate = new Date(currentTeamLeaderStart)
    leaderEndDate.setDate(leaderEndDate.getDate() + leaderDuration)

    teamMembers.push({
      id: teamMembers.length + 1,
      role: 'teamleader',
      name: teamLeaderNames[Math.floor(Math.random() * teamLeaderNames.length)],
      confirmed: true,
      startDate: currentTeamLeaderStart.toISOString().split('T')[0],
      endDate: leaderEndDate.toISOString().split('T')[0],
      contact: {
        phone: `+49 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
        email: 'team.leader@connext.de'
      },
      equipment: {
        tablet: `TB-2024-${campaignId}-TL${teamMembers.length + 1}`,
        clothing: ['Jacket-L', 'Shirt-L-2x', 'Pants-L', 'Pullover-L'],
        ids: {
          drk: `DRK-${Math.floor(Math.random() * 10000)}`,
          connext: `CNX-${Math.floor(Math.random() * 10000)}`
        }
      }
    })

    currentTeamLeaderStart = leaderEndDate
  }

  // Add 10 werbers
  for (let i = 0; i < 10; i++) {
    teamMembers.push({
      id: teamMembers.length + 1,
      role: 'werber',
      name: werberNames[Math.floor(Math.random() * werberNames.length)],
      confirmed: true,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      contact: {
        phone: `+49 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
        email: 'werber@connext.de'
      },
      equipment: {
        tablet: `TB-2024-${campaignId}-W${i + 1}`,
        clothing: ['Jacket-M', 'Shirt-M-2x', 'Pants-M', 'Pullover-M'],
        ids: {
          drk: `DRK-${Math.floor(Math.random() * 10000)}`,
          connext: `CNX-${Math.floor(Math.random() * 10000)}`
        }
      }
    })
  }

  return teamMembers
}

export function generateCampaigns(): Campaign[] {
  const campaigns: Campaign[] = []
  const targetCampaigns = 50
  const yearStart = new Date('2024-01-01')
  const yearEnd = new Date('2024-12-31')
  const totalDays = (yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
  const averageDaysBetweenCampaigns = totalDays / targetCampaigns

  let currentDate = new Date(yearStart)
  let campaignId = 1

  while (campaigns.length < targetCampaigns && currentDate < yearEnd) {
    const city = cities[Math.floor(Math.random() * cities.length)]
    const duration = Math.floor(Math.random() * (56 - 28 + 1) + 28) // 4-8 weeks in days
    const endDate = new Date(currentDate)
    endDate.setDate(endDate.getDate() + duration)

    // Skip if campaign would extend into 2025
    if (endDate.getFullYear() > 2024) break

    const teamMembers = generateTeamMembers(currentDate, endDate, campaignId)

    campaigns.push({
      id: campaignId,
      name: `${city.state} Kampagne ${Math.floor((currentDate.getMonth() + 1) / 3) + 1}Q/24`,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: currentDate > new Date() ? 'planned' : 'active',
      location: city.name,
      team: {
        current: teamMembers,
        maxSize: 15 // 10 werbers + up to 5 team leaders
      },
      resources: {
        accommodation: {
          confirmed: 12,
          required: 12,
          details: {
            address: `Hotel ${city.name} Central, Hauptstraße ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 90000 + 10000)} ${city.name}`,
            contact: `Hr. Müller +49 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
            checkIn: '15:00',
            checkOut: '11:00'
          }
        },
        vehicles: {
          confirmed: 3,
          required: 3,
          list: [
            {
              id: 1,
              type: 'rental',
              name: 'VW Transporter',
              licensePlate: `${city.name.substring(0, 1)}-CN ${Math.floor(Math.random() * 900 + 100)}`,
              rental: {
                company: 'AutoRent Deutschland',
                contact: `Hr. Schmidt +49 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
                startDate: currentDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                cost: 1200
              }
            },
            {
              id: 2,
              type: 'owned',
              name: 'DRK Sprinter',
              licensePlate: `${city.name.substring(0, 1)}-DRK ${Math.floor(Math.random() * 900 + 100)}`
            }
          ]
        },
        equipment: {
          confirmed: teamMembers.length * 4,
          required: teamMembers.length * 4,
          list: [
            {
              id: 1,
              type: 'tablet',
              name: 'iPad 2024',
              quantity: {
                total: teamMembers.length,
                assigned: teamMembers.length
              },
              status: 'available'
            },
            {
              id: 2,
              type: 'clothing',
              name: 'Uniform Set',
              quantity: {
                total: teamMembers.length * 4,
                assigned: teamMembers.length * 4
              },
              status: 'available'
            }
          ]
        },
        promotional: {
          flyers: 5000,
          keychains: 1000,
          other: [
            { name: 'Kugelschreiber', quantity: 2000 },
            { name: 'Notizblöcke', quantity: 1000 }
          ]
        }
      },
      redCrossOffice: {
        id: campaignId,
        name: `DRK ${city.name}`,
        location: city.name,
        contact: {
          name: `Fr. ${['Bauer', 'Schmidt', 'Meyer', 'Weber'][Math.floor(Math.random() * 4)]}`,
          role: 'Kampagnenkoordinator',
          phone: `+49 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
          email: `koordinator@drk-${city.name.toLowerCase()}.de`
        },
        address: {
          street: `Rotkreuzplatz ${Math.floor(Math.random() * 50)}`,
          city: city.name,
          zip: Math.floor(Math.random() * 90000 + 10000).toString()
        }
      }
    })

    // Move to next campaign start date (add average gap with some randomness)
    const gapDays = Math.floor(averageDaysBetweenCampaigns * (0.8 + Math.random() * 0.4)) // ±20% variation
    currentDate = new Date(endDate)
    currentDate.setDate(currentDate.getDate() + gapDays)
    campaignId++
  }

  return campaigns
}
