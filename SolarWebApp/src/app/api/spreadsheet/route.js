// src/app/api/spreadsheet/route.js

import { google } from 'googleapis';

export async function POST(request) {
  try {
    const { accessToken, title, sheetData } = await request.json();

    if (!accessToken || !sheetData) {
      return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: title || 'Solar Recommendations' }
      }
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: sheetData }
    });

    return new Response(
      JSON.stringify({
        url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
        id: spreadsheetId,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    return new Response(JSON.stringify({ error: 'Failed to export to Google Sheets' }), {
      status: 500,
    });
  }
}
