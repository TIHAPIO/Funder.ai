import { NextResponse } from 'next/server';
import { generateCampaigns } from '../../../utils/campaign-generator';
import { adminDb } from '../../../lib/firebase-admin';

export async function POST() {
  try {
    // Verify environment variables
    if (!process.env.FIREBASE_PROJECT_ID || 
        !process.env.FIREBASE_CLIENT_EMAIL || 
        !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Missing Firebase credentials in environment variables');
    }

    console.log('Generating test campaigns...');
    const campaigns = generateCampaigns();
    
    console.log(`Generated ${campaigns.length} campaigns`);
    console.log('Writing to database...');

    // Split campaigns into chunks of 500 (Firestore batch limit)
    const chunkSize = 500;
    for (let i = 0; i < campaigns.length; i += chunkSize) {
      const chunk = campaigns.slice(i, i + chunkSize);
      const batch = adminDb.batch();
      
      // Add campaigns in batches
      chunk.forEach((campaign) => {
        const campaignRef = adminDb.collection('campaigns').doc();
        batch.set(campaignRef, {
          ...campaign,
          id: parseInt(campaignRef.id)
        });
      });

      await batch.commit();
      console.log(`Wrote chunk ${Math.floor(i / chunkSize) + 1}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully generated and wrote ${campaigns.length} campaigns` 
    });
  } catch (error) {
    console.error('Error generating test data:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
    }, { status: 500 });
  }
}

// Allow OPTIONS requests for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
