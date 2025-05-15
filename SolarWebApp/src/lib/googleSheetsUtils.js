// lib/googleSheets.js

import { google } from 'googleapis';

export async function createSpreadsheet(accessToken, title, data) {
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
    requestBody: { values: data }
  });

  return {
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    id: spreadsheetId
  };
}
