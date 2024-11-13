import { where, QueryConstraint, QueryDocumentSnapshot } from 'firebase/firestore';
import { BaseFirestoreService } from './base';
import { Campaign } from '../../types/campaign';

export class CampaignService extends BaseFirestoreService<Campaign> {
  constructor() {
    super('campaigns');
  }

  async getAllCampaigns(pageNumber: number = 1): Promise<{
    items: Campaign[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber);
  }

  async getCampaignsByDateRange(
    startDate: Date,
    endDate: Date,
    pageNumber: number = 1
  ): Promise<{
    items: Campaign[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [
      where('startDate', '>=', startDate.toISOString().split('T')[0]),
      where('startDate', '<=', endDate.toISOString().split('T')[0])
    ]);
  }

  async getActiveCampaigns(pageNumber: number = 1): Promise<{
    items: Campaign[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('status', '==', 'active')]);
  }

  async getUpcomingCampaigns(pageNumber: number = 1): Promise<{
    items: Campaign[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    const today = new Date().toISOString().split('T')[0];
    return this.getPage(pageNumber, [where('startDate', '>=', today)]);
  }

  async addTeamMember(campaignId: number, userId: string, role: string): Promise<void> {
    // TODO: Implement team member management
    // This might require a subcollection for team members
    throw new Error('Not implemented');
  }

  async removeTeamMember(campaignId: number, userId: string): Promise<void> {
    // TODO: Implement team member management
    throw new Error('Not implemented');
  }

  async updateStatus(campaignId: number, status: Campaign['status']): Promise<void> {
    return this.update(campaignId, { status });
  }

  async updateDates(
    campaignId: number,
    startDate: string,
    endDate: string
  ): Promise<void> {
    return this.update(campaignId, { startDate, endDate });
  }

  // New method for bulk adding campaigns
  async bulkAddCampaigns(campaigns: Campaign[]): Promise<void> {
    return this.bulkAdd(campaigns);
  }
}

export const campaignService = new CampaignService();
