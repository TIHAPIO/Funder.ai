async function triggerTestDataGeneration() {
  try {
    console.log('Triggering test data generation...');
    const response = await fetch('http://localhost:3001/api/generate-test-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', responseText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, error: ${responseData.error}`);
    }

    console.log('Result:', responseData);
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error && error.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

// Execute immediately
triggerTestDataGeneration();
