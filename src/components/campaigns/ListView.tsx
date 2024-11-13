import { Campaign } from '@/types/campaign'
import { Users, Car, Building, Box, AlertTriangle, Phone, Mail, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { getResourceStatus, getTeamStatus, formatDate } from '@/utils/campaign-helpers'
import { useState } from 'react'

interface ListViewProps {
  campaigns: Campaign[]
}

export function ListView({ campaigns }: ListViewProps) {
  const [expandedCampaigns, setExpandedCampaigns] = useState<number[]>([])

  const toggleCampaign = (campaignId: number) => {
    setExpandedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    )
  }

  return (
    <div className="h-[calc(100%-4rem)] overflow-auto px-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid gap-4">
          {campaigns.map(campaign => {
            const isExpanded = expandedCampaigns.includes(campaign.id)

            return (
              <div
                key={campaign.id}
                className={`
                  rounded-lg border shadow-sm overflow-hidden transition-all duration-200
                  ${campaign.status === 'completed' ? 'bg-card border-border' :
                    campaign.status === 'active' ? 'bg-green-50 border-green-200' :
                    campaign.status === 'preparation' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'}
                `}
              >
                {/* Header Section - Always visible */}
                <div 
                  className="p-4 border-b bg-white/50 cursor-pointer hover:bg-white/70 transition-colors"
                  onClick={() => toggleCampaign(campaign.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{campaign.name}</h3>
                        <span className={`
                          text-sm px-2 py-0.5 rounded-full capitalize
                          ${campaign.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                            campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                            campaign.status === 'preparation' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'}
                        `}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{campaign.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm px-3 py-1 rounded-full bg-muted">
                          {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Quick Stats - Always visible */}
                  <div className="grid grid-cols-4 gap-6 mt-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{campaign.team.current.length}/{campaign.team.maxSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {campaign.resources.accommodation.confirmed}/{campaign.resources.accommodation.required}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {campaign.resources.vehicles.confirmed}/{campaign.resources.vehicles.required}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {campaign.resources.equipment.confirmed}/{campaign.resources.equipment.required}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Team Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-muted-foreground" />
                          <h4 className="font-medium">Team ({campaign.team.current.length}/{campaign.team.maxSize})</h4>
                        </div>
                        <div className="space-y-2">
                          {campaign.team.current.map(member => (
                            <div key={member.id} className="bg-white/80 rounded-lg p-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${member.confirmed ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="font-medium">{member.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 ml-4">
                                {member.role === 'teamleader' ? 'Teamleader' : 'Werber'}
                              </div>
                            </div>
                          ))}
                          {campaign.team.current.length < campaign.team.maxSize && (
                            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 rounded-lg p-2">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-sm">{campaign.team.maxSize - campaign.team.current.length} offene Positionen</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Accommodation Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-muted-foreground" />
                          <h4 className="font-medium">Unterkunft</h4>
                        </div>
                        <div className={`text-sm px-3 py-2 rounded-lg ${getResourceStatus(
                          campaign.resources.accommodation.confirmed,
                          campaign.resources.accommodation.required
                        ).color}`}>
                          {getResourceStatus(
                            campaign.resources.accommodation.confirmed,
                            campaign.resources.accommodation.required
                          ).text}
                        </div>
                        {campaign.resources.accommodation.details && (
                          <div className="bg-white/80 rounded-lg p-2 text-sm space-y-1">
                            <div className="font-medium">{campaign.resources.accommodation.details.address}</div>
                            <div className="text-muted-foreground">{campaign.resources.accommodation.details.contact}</div>
                          </div>
                        )}
                      </div>

                      {/* Vehicles Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Car className="w-5 h-5 text-muted-foreground" />
                          <h4 className="font-medium">Fahrzeuge</h4>
                        </div>
                        <div className={`text-sm px-3 py-2 rounded-lg ${getResourceStatus(
                          campaign.resources.vehicles.confirmed,
                          campaign.resources.vehicles.required
                        ).color}`}>
                          {getResourceStatus(
                            campaign.resources.vehicles.confirmed,
                            campaign.resources.vehicles.required
                          ).text}
                        </div>
                        {campaign.resources.vehicles.list.length > 0 && (
                          <div className="space-y-2">
                            {campaign.resources.vehicles.list.map(vehicle => (
                              <div key={vehicle.id} className="bg-white/80 rounded-lg p-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${vehicle.type === 'owned' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                                  <span className="font-medium">{vehicle.name}</span>
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
                          <Box className="w-5 h-5 text-muted-foreground" />
                          <h4 className="font-medium">Ausrüstung</h4>
                        </div>
                        <div className={`text-sm px-3 py-2 rounded-lg ${getResourceStatus(
                          campaign.resources.equipment.confirmed,
                          campaign.resources.equipment.required
                        ).color}`}>
                          {getResourceStatus(
                            campaign.resources.equipment.confirmed,
                            campaign.resources.equipment.required
                          ).text}
                        </div>
                        {campaign.resources.equipment.list.length > 0 && (
                          <div className="space-y-2">
                            {campaign.resources.equipment.list.map(item => (
                              <div key={item.id} className="bg-white/80 rounded-lg p-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${
                                    item.status === 'available' ? 'bg-green-500' :
                                    item.status === 'partially_available' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`} />
                                  <span className="font-medium">{item.name}</span>
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
                    <div className="mt-6 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/80 rounded-lg p-3">
                          <h4 className="font-medium mb-2">DRK Ansprechpartner</h4>
                          <div className="space-y-2 text-sm">
                            <div className="font-medium">{campaign.redCrossOffice.contact.name}</div>
                            <div className="text-muted-foreground">{campaign.redCrossOffice.contact.role}</div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span>{campaign.redCrossOffice.contact.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span>{campaign.redCrossOffice.contact.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/80 rounded-lg p-3">
                          <h4 className="font-medium mb-2">DRK Geschäftsstelle</h4>
                          <div className="space-y-2 text-sm">
                            <div className="font-medium">{campaign.redCrossOffice.name}</div>
                            <div className="text-muted-foreground">
                              <div>{campaign.redCrossOffice.address.street}</div>
                              <div>{campaign.redCrossOffice.address.zip} {campaign.redCrossOffice.address.city}</div>
                            </div>
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
