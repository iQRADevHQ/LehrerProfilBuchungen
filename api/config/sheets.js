const { google } = require('googleapis');
require('dotenv').config();

// Google Sheets Konfiguration
const SHEETS_CONFIG = {
    SOURCE_SHEET_ID: '1-wiTnD2XA3pX1vShG9hnWgzQ2QNVwh7Hkcz0ej3sq8g',
    TARGET_SHEET_ID: '1sv0E7ZQdKsMFBfCeMLeY63jDgEBBYdR069PILqJjsDM'
};

// Scopes für Google Sheets API
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
];

// Google Auth Konfiguration
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    scopes: SCOPES
});

// Sheets Client initialisieren
const sheets = google.sheets({ version: 'v4', auth });

module.exports = {
    sheets,
    SHEETS_CONFIG
};