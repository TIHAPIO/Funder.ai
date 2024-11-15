import { Campaign } from '../../types/campaign'
import { Users, Car, Building, Box, AlertTriangle, Phone, Mail, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { getResourceStatus, getTeamStatus, formatDate } from '../../utils/campaign-helpers'
import { useState, useCallback } from 'react'

interface ListViewProps {
  campaigns: Campaign[]
}

const statusColors = {
  completed: 'bg-muted/50 dark:bg-muted/50 border-border/50 dark:border-border/50 text-muted-foreground dark:text-muted-foreground',
  active: 'bg-green-100/50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
  preparation: 'bg-yellow-100/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
  planned: 'bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
}

const statusLabels = {
  completed: 'Abgeschlossen',
  active: 'Aktiv',
  preparation: 'In Vorbereitung',
  planned: 'Geplant'
}

export function ListView({ campaigns }: ListViewProps) {
  const [expandedCampaigns, setExpandedCampaigns] = useState<number[]>([])

  const toggleCampaign = useCallback((campaignId: number) => {
    setExpandedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    )
  }, [])

  const handleKeyPress = useCallback((e: React.KeyboardEvent, campaignId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleCampaign(campaignId)
    }
  }, [toggleCampaign])

  return (
    <div 
      className="h-[calc(100%-4rem)] overflow-auto px-4"
      role="region"
      aria-label="Kampagnen Liste"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="grid gap-4" role="list">
          {campaigns.map(campaign => {
            const isExpanded = expandedCampaigns.includes(campaign.id)
            const teamStatus = getTeamStatus(campaign.team)
            const resourceStatus = {
              accommodation: getResourceStatus(campaign.resources.accommodation.confirmed, campaign.resources.accommodation.required),
              vehicles: getResourceStatus(campaign.resources.vehicles.confirmed, campaign.resources.vehicles.required),
              equipment: getResourceStatus(campaign.resources.equipment.confirmed, campaign.resources.equipment.required)
            }

            return (
              <div
                key={campaign.id}
                className={`
                  rounded-lg border shadow-sm overflow-hidden transition-all duration-200
                  ${statusColors[campaign.status]}
                `}
                role="listitem"
              >
                {/* Header Section - Always visible */}
                <div 
                  className="p-4 border-b bg-background/50 dark:bg-background/50 cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors"
                  onClick={() => toggleCampaign(campaign.id)}
                  onKeyDown={(e) => handleKeyPress(e, campaign.id)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                  aria-controls={`campaign-content-${campaign.id}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-foreground dark:text-foreground">{campaign.name}</h3>
                        <span className={`
                          text-sm px-2 py-0.5 rounded-full capitalize
                          ${statusColors[campaign.status]}
                        `}>
                          {statusLabels[campaign.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        <span>{campaign.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <span className="text-sm px-3 py-1 rounded-full bg-muted dark:bg-muted">
                          {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-6 mt-3">
                    <div 
                      className="flex items-center gap-2"
                      role="status"
                      aria-label={`Team Status: ${teamStatus.text} Mitglieder`}
                    >
                      <Users className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <span className="text-sm text-foreground dark:text-foreground">{teamStatus.text}</span>
                    </div>
                    <div 
                      className="flex items-center gap-2"
                      role="status"
                      aria-label={`Unterkunft Status: ${resourceStatus.accommodation.text}`}
                    >
                      <Building className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <span className="text-sm text-foreground dark:text-foreground">
                        {resourceStatus.accommodation.text}
                      </span>
                    </div>
                    <div 
                      className="flex items-center gap-2"
                      role="status"
                      aria-label={`Fahrzeug Status: ${resourceStatus.vehicles.text}`}
                    >
                      <Car className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <span className="text-sm text-foreground dark:text-foreground">
                        {resourceStatus.vehicles.text}
                      </span>
                    </div>
                    <div 
                      className="flex items-center gap-2"
                      role="status"
                      aria-label={`Ausrüstung Status: ${resourceStatus.equipment.text}`}
                    >
                      <Box className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <span className="text-sm text-foreground dark:text-foreground">
                        {resourceStatus.equipment.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div 
                    id={`campaign-content-${campaign.id}`}
                    className="p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Team Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                          <h4 className="font-medium text-foreground dark:text-foreground">
                            Team ({teamStatus.text})
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {campaign.team.current.map(member => (
                            <div 
                              key={member.id} 
                              className="bg-background/80 dark:bg-background/80 rounded-lg p-2 text-sm"
                              role="listitem"
                            >
                              <div className="flex items-center gap-2">
                                <span 
                                  className={`w-2 h-2 rounded-full ${member.confirmed ? 'bg-green-500' : 'bg-red-500'}`}
                                  aria-hidden="true"
                                />
                                <span className="font-medium text-foreground dark:text-foreground">{member.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 ml-4">
                                {member.role === 'teamleader' ? 'Teamleader' : 'Werber'}
                              </div>
                            </div>
                          ))}
                          {campaign.team.current.length < campaign.team.maxSize && (
                            <div 
                              className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg p-2"
                              role="alert"
                            >
                              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                              <span className="text-sm">
                                {campaign.team.maxSize - campaign.team.current.length} offene Positionen
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Accommodation Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                          <h4 className="font-medium text-foreground dark:text-foreground">Unterkunft</h4>
                        </div>
                        <div 
                          className={`text-sm px-3 py-2 rounded-lg ${resourceStatus.accommodation.color}`}
                          role="status"
                        >
                          {resourceStatus.accommodation.text}
                        </div>
                        {campaign.resources.accommodation.details && (
                          <div className="bg-background/80 dark:bg-background/80 rounded-lg p-2 text-sm space-y-1">
                            <div className="font-medium text-foreground dark:text-foreground">
                              {campaign.resources.accommodation.details.address}
                            </div>
                            <div className="text-muted-foreground">
                              {campaign.resources.accommodation.details.contact}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Vehicles Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Car className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                          <h4 className="font-medium text-foreground dark:text-foreground">Fahrzeuge</h4>
                        </div>
                        <div 
                          className={`text-sm px-3 py-2 rounded-lg ${resourceStatus.vehicles.color}`}
                          role="status"
                        >
                          {resourceStatus.vehicles.text}
                        </div>
                        {campaign.resources.vehicles.list.length > 0 && (
                          <div className="space-y-2" role="list">
                            {campaign.resources.vehicles.list.map(vehicle => (
                              <div 
                                key={vehicle.id} 
                                className="bg-background/80 dark:bg-background/80 rounded-lg p-2 text-sm"
                                role="listitem"
                              >
                                <div className="flex items-center gap-2">
                                  <span 
                                    className={`w-2 h-2 rounded-full ${vehicle.type === 'owned' ? 'bg-blue-500' : 'bg-purple-500'}`}
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium text-foreground dark:text-foreground">
                                    {vehicle.name}
                                  </span>
                                </div>
                                {vehicle.licensePlate && (
                                  <div className="text-xs text-muted-foreground mt-1 ml-4">
                                    {vehicle.licensePlate}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Equipment Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Box className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                          <h4 className="font-medium text-foreground dark:text-foreground">Ausrüstung</h4>
                        </div>
                        <div 
                          className={`text-sm px-3 py-2 rounded-lg ${resourceStatus.equipment.color}`}
                          role="status"
                        >
                          {resourceStatus.equipment.text}
                        </div>
                        {campaign.resources.equipment.list.length > 0 && (
                          <div className="space-y-2" role="list">
                            {campaign.resources.equipment.list.map(item => (
                              <div 
                                key={item.id} 
                                className="bg-background/80 dark:bg-background/80 rounded-lg p-2 text-sm"
                                role="listitem"
                              >
                                <div className="flex items-center gap-2">
                                  <span 
                                    className={`w-2 h-2 rounded-full ${
                                      item.status === 'available' ? 'bg-green-500' :
                                      item.status === 'partially_available' ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium text-foreground dark:text-foreground">
                                    {item.name}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 ml-4">
                                  {item.quantity.assigned}/{item.quantity.total} verfügbar
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-6 pt-4 border-t border-border dark:border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-background/80 dark:bg-background/80 rounded-lg p-3">
                          <h4 className="font-medium mb-2 text-foreground dark:text-foreground">
                            DRK Ansprechpartner
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="font-medium text-foreground dark:text-foreground">
                              {campaign.redCrossOffice.contact.name}
                            </div>
                            <div className="text-muted-foreground">
                              {campaign.redCrossOffice.contact.role}
                            </div>
                            <a 
                              href={`tel:${campaign.redCrossOffice.contact.phone}`}
                              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Phone className="w-4 h-4" aria-hidden="true" />
                              <span>{campaign.redCrossOffice.contact.phone}</span>
                            </a>
                            <a 
                              href={`mailto:${campaign.redCrossOffice.contact.email}`}
                              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Mail className="w-4 h-4" aria-hidden="true" />
                              <span>{campaign.redCrossOffice.contact.email}</span>
                            </a>
                          </div>
                        </div>
                        <div className="bg-background/80 dark:bg-background/80 rounded-lg p-3">
                          <h4 className="font-medium mb-2 text-foreground dark:text-foreground">
                            DRK Geschäftsstelle
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="font-medium text-foreground dark:text-foreground">
                              {campaign.redCrossOffice.name}
                            </div>
                            <address className="text-muted-foreground not-italic">
                              <div>{campaign.redCrossOffice.address.street}</div>
                              <div>{campaign.redCrossOffice.address.zip} {campaign.redCrossOffice.address.city}</div>
                            </address>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
