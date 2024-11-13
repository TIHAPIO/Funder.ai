import { Campaign } from '@/types/campaign';
import { generateCampaigns } from '@/utils/campaign-generator';

// Generate all campaigns once and store them
const allCampaigns = generateCampaigns();

// Export all campaigns for 2024
export const campaigns2024 = allCampaigns.filter(campaign => {
  const startDate = new Date(campaign.startDate);
  return startDate.getFullYear() === 2024;
});

// Helper function to get campaigns for a specific quarter
function getQuarterCampaigns(campaigns: Campaign[], quarter: 1 | 2 | 3 | 4): Campaign[] {
  const startMonth = (quarter - 1) * 3;
  const endMonth = startMonth + 2;
  
  return campaigns.filter(campaign => {
    const startDate = new Date(campaign.startDate);
    const month = startDate.getMonth();
    return month >= startMonth && month <= endMonth;
  });
}

// Export individual quarters using the same campaign instances
export const q1Campaigns = getQuarterCampaigns(campaigns2024, 1);
export const q2Campaigns = getQuarterCampaigns(campaigns2024, 2);
export const q3Campaigns = getQuarterCampaigns(campaigns2024, 3);
export const q4Campaigns = getQuarterCampaigns(campaigns2024, 4);
