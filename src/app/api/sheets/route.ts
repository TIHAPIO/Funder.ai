import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { sheetConfigs } from '@/app/resources/types';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function createSheet(config: { title: string; headers: readonly string[] }) {
  try {
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: config.title,
        },
        sheets: [
          {
            properties: {
              title: 'Daten',
            },
            data: [
              {
                rowData: [
                  {
                    values: [...config.headers].map(header => ({
                      userEnteredValue: { stringValue: header },
                      userEnteredFormat: {
                        backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 },
                        textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                      },
                    })),
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    return spreadsheet.data.spreadsheetId;
  } catch (error) {
    console.error('Error creating sheet:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const category = searchParams.get('category');

    if (!category || !(category in sheetConfigs)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    if (action === 'getData') {
      const spreadsheetId = process.env[`SHEET_ID_${category.toUpperCase()}`];
      
      if (!spreadsheetId) {
        // Create new sheet if it doesn't exist
        const config = sheetConfigs[category as keyof typeof sheetConfigs];
        const newSpreadsheetId = await createSheet(config);
        
        // Return empty data array since the sheet was just created
        return NextResponse.json({
          success: true,
          data: [config.headers],
          spreadsheetId: newSpreadsheetId,
          isNew: true,
        });
      }

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Daten',
      });

      return NextResponse.json({
        success: true,
        data: response.data.values || [sheetConfigs[category as keyof typeof sheetConfigs].headers],
        spreadsheetId, // Add spreadsheetId to response for existing sheets
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { spreadsheetId, range, values } = await request.json();

    if (!spreadsheetId || !range || !values) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
