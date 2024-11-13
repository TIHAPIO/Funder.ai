import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { generateCampaigns } from '../src/utils/campaign-generator';

async function generateTestData() {
  try {
    // Initialize Firebase Admin
    const app = initializeApp({
      credential: cert({
        projectId: "fundrai",
        clientEmail: "firebase-adminsdk-yhog5@fundrai.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCQnH/na2Zoc14A\nWXtUcQp4w7FCFxN3a2F8vTfVU21mEeQkT0LLXe1WDwh4p83DgrxLsOeCwKPWzUc8\ngisonqz4p7StGxxv8Md43W/BzLLlE9aJ3jiQ1+HSw9z7e5LzQtP+3bqz7HvXgL9R\nI+9YxfFcXGYmp5orVYYyDHnI9fxLS1iaJSKZnMK0Z87PEHcHh4RBlG4/N0JABvkQ\neThftwQHM7F8iDmmUU0C3l8y+eIDcXJf3NxG+mXf9vYkZY6g8CcA9vZNQbpJlO2C\nJSXzLwFdnhs70MrdQk/JfL8XtUuW3HhxnHYyUZBE+Hytv8oAza4zrorWxQeqk8ja\nA7iQxWUfAgMBAAECggEAAKBs/Xe9rd4yHhZFLox+2x8d+YdYEkBo372CLG58HuEc\n9/tP8smpaaIPC1bO0XYTktBlcG+dRiUFlgGKZlapsToo0kc3zFRiyOdMwK4+aDe5\nykcoP5hv5hXrMzvJ2zwC5yvWz0jLEJgCPDvHob7Z2OidmLVJOb7ZIgZj0LcgLMNZ\nKAj6HLf8OcwOVAQDd+eWekPYoJ+LD8M/uENOTSXeCfc/O8eZjFiBAZhOxAOxeTPH\naOwdYZMIzZCGJq76WjnjW3twzVKNpyDxImyqi2fahpCaM8yfPjHfOx4iz2wxZYiS\n1qs5vboLI6nPMs9EC2FikhV++PIzJ/cqZVdqNjUbYQKBgQDBdcPPSFs+vKxRpRqi\nlsdhMnTJh/uxxX5EElF8lhRDSv7eJiJhzc6St2wNPFb/iqgwSGHovwJPGWZAOMbo\n8YcGguMvUC3sNfXgF8idm8THTDJ5JCAOVmBeDUAxzErk0ntw+u0T3NxCo/vLCfKW\n8flmZvzYRBqJecojrIARLL3mNQKBgQC/XCWzJBkAjuo/zbVkvVHSEKJx0FF7eHOK\nKk0VhPoFZIMRgreTY0fRpGctneJx49OF93VE8ChsxV588dAxODU4fyknpx+LqLgN\n/JG+XHbokGdWAx3Ezf2BEYojU4aCDlJFcTgHVacAXzsEAu6u3qrcG/VAmNIQEdmL\nezS7j+k4gwKBgCSTxoTfclkHRTFenQ2WonXPG2OrMTxoUbo/GGcM3SHoAQ4xeZiy\nV9dHlMdf3DcOmUQfu1tNGfuomruTwI/0cooZnyin6Tba8PUAqi6ab/caggSDfwgW\n7rt5l+SScqqW3T38Q2zY+lAjPw0hgVtmvrfMywt8vOO3Qi/Cgqg8pF7tAoGATr8D\nwJFVPJaTLQhg4gDKX9B6mK1qKo4ptayspfNf08JF8XnCQ4OydUHbN7lmCwn+7H0l\no+XULNaXiIEV9Hs143bon6m1YIpgm1jZPOXeBNwPuiR0Jp3B+VAXcWwYyQJNtsfd\nj58epxeJOKBgSlPVKdjTdu6sWvKNfEmKLLkO9zMCgYBGyZjsgL5RPHFqw3lFIs30\ncDXuzhXYhE4+SZppWthazGPuYmqeb4ZEcCTUC66DHBg4qTfh3G15Blz9kOQcPgli\nQfEhWlFFLIPXT7S8XdAQaZnV2g5ICJWJsa0yLs/wbZGShIItUKb6rqV4Wl5VxpGh\n9GHl8agRSpLGRkMefEPftA==\n-----END PRIVATE KEY-----\n"
      })
    });

    // Get Firestore instance
    const db = getFirestore(app);

    console.log('Generating test campaigns...');
    const campaigns = generateCampaigns();
    
    console.log(`Generated ${campaigns.length} campaigns`);
    console.log('Writing to database...');

    // Split campaigns into chunks of 500 (Firestore batch limit)
    const chunkSize = 500;
    for (let i = 0; i < campaigns.length; i += chunkSize) {
      const chunk = campaigns.slice(i, i + chunkSize);
      const batch = db.batch();
      
      // Add campaigns in batches
      chunk.forEach((campaign) => {
        const campaignRef = db.collection('campaigns').doc();
        batch.set(campaignRef, {
          ...campaign,
          id: parseInt(campaignRef.id)
        });
      });

      await batch.commit();
      console.log(`Wrote chunk ${Math.floor(i / chunkSize) + 1}`);
    }
    
    console.log('Successfully wrote test data');
  } catch (error) {
    console.error('Error generating test data:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
  }
}

// Execute immediately
generateTestData();
